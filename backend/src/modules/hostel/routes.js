import { Router } from "express";
import hostelRouter from "./hostel/routes/hostel.routes.js";
import blocksRouter from "./blocks/routes/block.routes.js";
import floorsRouter from "./floors/routes/floor.routes.js";
import roomsRouter from "./rooms/routes/room.routes.js";
import bedsRouter from "./beds/routes/bed.routes.js";
import allocationsRouter from "./allocations/routes/allocation.routes.js";
import complaintsRouter from "./complaints/routes/complaint.routes.js";
import leaveRouter from "./leave/routes/leave.routes.js";
import visitorsRouter from "./visitors/routes/visitor.routes.js";
import furnitureRouter from "./furniture/routes/furniture.routes.js";
import feesRouter from "./fees/routes/fee.routes.js";

const router = Router();

router.use("/hostels", hostelRouter);
router.use("/blocks", blocksRouter);
router.use("/floors", floorsRouter);
router.use("/rooms", roomsRouter);
router.use("/beds", bedsRouter);
router.use("/allocations", allocationsRouter);
router.use("/complaints", complaintsRouter);
router.use("/leaves", leaveRouter);
router.use("/visitors", visitorsRouter);
router.use("/furniture", furnitureRouter);
router.use("/fees", feesRouter);

export default router;
