import {
  GenericMutationCtx,
  GenericQueryCtx,
} from "convex/server";
import { DataModel } from "./dataModel";

export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;

export declare const query: any;
export declare const mutation: any;
export declare const action: any;
