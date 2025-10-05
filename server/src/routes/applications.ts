import { Router } from "express";
import Application from "../models/Application";
import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";
import { createApplicationSchema } from "../validators/application";

const router = Router();
router.use(requireAuth);

// Create (DRAFT or SUBMITTED)
router.post("/", async (req, res, next) => {
  try {
    const data = createApplicationSchema.parse(req.body);
    const app = await Application.create({
      citizen: req.user!._id,
      serviceType: data.serviceType,
      status: data.submit ? "SUBMITTED" : "DRAFT",
      payload: data.payload,
      history: [
        { by: req.user!._id, action: "CREATED" },
        data.submit ? { by: req.user!._id, action: "SUBMITTED" } : null,
      ].filter(Boolean),
    });
    res.status(201).json(app);
  } catch (e) {
    next(e);
  }
});

// List (role-aware)
router.get("/", async (req, res, next) => {
  try {
    const filter: any = {};
    if (req.user!.role === "citizen") filter.citizen = req.user!._id;
    if (req.query.status) filter.status = req.query.status;

    const q = Application.find(filter).sort({ updatedAt: -1 }).limit(200);

    // Only populate user info for clerks/admins
    if (req.user!.role !== "citizen") {
      q.populate("citizen", "email firstName lastName");
    }

    const apps = await q.exec();
    res.json(apps);
  } catch (e) {
    next(e);
  }
});

// Approve (clerk/admin)
router.post(
  "/:id/approve",
  requireRole("clerk", "admin"),
  async (req, res, next) => {
    try {
      const app = await Application.findByIdAndUpdate(
        req.params.id,
        {
          status: "APPROVED",
          $push: {
            history: { by: req.user!._id, action: "APPROVED" },
          },
        },
        { new: true }
      );
      if (!app)
        return res.status(404).json({ message: "Application not found" });
      res.json(app);
    } catch (e) {
      next(e);
    }
  }
);

// Request more info (clerk/admin)
router.post(
  "/:id/request-info",
  requireRole("clerk", "admin"),
  async (req, res, next) => {
    try {
      const { note } = req.body;
      if (!note || typeof note !== "string" || note.trim().length < 3)
        return res.status(400).json({ message: "Note is required" });

      const app = await Application.findByIdAndUpdate(
        req.params.id,
        {
          status: "NEEDS_INFO",
          $push: {
            history: {
              by: req.user!._id,
              action: "REQUEST_INFO",
              note,
            },
          },
        },
        { new: true }
      );
      if (!app)
        return res.status(404).json({ message: "Application not found" });
      res.json(app);
    } catch (e) {
      next(e);
    }
  }
);

// Reject (clerk/admin)
router.post(
  "/:id/reject",
  requireRole("clerk", "admin"),
  async (req, res, next) => {
    try {
      const { note } = req.body;
      const app = await Application.findByIdAndUpdate(
        req.params.id,
        {
          status: "REJECTED",
          $push: {
            history: {
              by: req.user!._id,
              action: "REJECTED",
              note: note || null,
            },
          },
        },
        { new: true }
      );
      if (!app)
        return res.status(404).json({ message: "Application not found" });
      res.json(app);
    } catch (e) {
      next(e);
    }
  }
); // RESUBMIT (citizen)
// Allowed when the app belongs to the current user and is in NEEDS_INFO (or REJECTED/DRAFT if you want).
router.post(
  "/:id/resubmit",
  requireRole("citizen", "admin"),
  async (req, res, next) => {
    try {
      const { note, payload } = req.body as {
        note?: string;
        payload?: Record<string, unknown>;
      };

      if (!note || typeof note !== "string" || note.trim().length < 3) {
        return res
          .status(400)
          .json({ message: "Note is required (min 3 chars)" });
      }

      // Load the application so we can verify ownership and (optionally) merge payload
      const app = await Application.findById(req.params.id);
      if (!app)
        return res.status(404).json({ message: "Application not found" });

      // Only the owning citizen (or admin if you keep it) can resubmit
      const isOwner = app.citizen?.toString?.() === req.user!._id;
      const isAdmin = req.user!.role === "admin";
      if (!isOwner && !isAdmin) {
        return res
          .status(403)
          .json({ message: "Not allowed to resubmit this application" });
      }

      // Gate which statuses can be resubmitted
      const allowed = ["NEEDS_INFO", "REJECTED", "DRAFT"];
      if (!allowed.includes(app.status)) {
        return res
          .status(400)
          .json({ message: `Cannot resubmit when status is ${app.status}` });
      }

      // Optionally merge any extra fields user provides into payload
      if (payload && typeof payload === "object") {
        app.payload = { ...(app.payload as any), ...payload };
      }

      app.status = "RESUBMITTED";
      app.history.push({
        by: req.user!._id,
        action: "RESUBMITTED",
        note: note.trim(),
      });

      await app.save();
      res.json(app);
    } catch (e) {
      next(e);
    }
  }
);

export default router;
