import { NextFunction, Request, Response } from "express";
import { CreateTransferItemUseCase } from "../use-case/create.use-case.js";
import { db } from "@src/database/database.js";

interface ResponseInterface {
  _id: string;
}

export const createController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const createTransferItemUseCase = new CreateTransferItemUseCase(db);
    const result = await createTransferItemUseCase.handle(req.body, {
      session,
      authorizationHeader: req.headers.authorization ?? "",
    });

    await db.commitTransaction();

    const responseValue: ResponseInterface = {
      _id: result._id,
    };

    res.status(201).json(responseValue);
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
