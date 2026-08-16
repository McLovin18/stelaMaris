import type { Timestamp } from "firebase/firestore";
import type { LandingFieldStyle } from "./landing-types";
import type { TranslatableText } from "./translations";

export type BlogBlockType = "subtitle" | "paragraph" | "image";

export type BlogFieldStyle = LandingFieldStyle;

export type BlogBlock =
  | {
      id: string;
      type: "subtitle";
      text: TranslatableText;
      style?: BlogFieldStyle;
    }
  | {
      id: string;
      type: "paragraph";
      text: TranslatableText;
      style?: BlogFieldStyle;
    }
  | {
      id: string;
      type: "image";
      url: string;
      alt?: TranslatableText;
      caption?: TranslatableText;
      style?: BlogFieldStyle;
    };

export interface Blog {
  id: string;
  title: TranslatableText;
  description: TranslatableText;
  blocks: BlogBlock[];
  featured?: boolean;
  status: "draft" | "published";
  position?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
