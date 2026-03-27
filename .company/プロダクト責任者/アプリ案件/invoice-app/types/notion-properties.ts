import type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

type Properties = PageObjectResponse["properties"];
type PropertyValue = Properties[string];

function getRichTextPlain(richText: RichTextItemResponse[]): string {
  return richText.map((t) => t.plain_text).join("");
}

export function getTitle(prop: PropertyValue): string {
  if (prop.type === "title") {
    return getRichTextPlain(prop.title);
  }
  return "";
}

export function getRichText(prop: PropertyValue): string {
  if (prop.type === "rich_text") {
    return getRichTextPlain(prop.rich_text);
  }
  return "";
}

export function getNumber(prop: PropertyValue): number {
  if (prop.type === "number") {
    return prop.number ?? 0;
  }
  return 0;
}

export function getSelect(prop: PropertyValue): string {
  if (prop.type === "select") {
    return prop.select?.name ?? "";
  }
  return "";
}

export function getStatus(prop: PropertyValue): string {
  if (prop.type === "status") {
    return prop.status?.name ?? "";
  }
  return "";
}

export function getDate(prop: PropertyValue): string {
  if (prop.type === "date") {
    return prop.date?.start ?? "";
  }
  return "";
}

export function getCheckbox(prop: PropertyValue): boolean {
  if (prop.type === "checkbox") {
    return prop.checkbox;
  }
  return false;
}

export function getRelationIds(prop: PropertyValue): string[] {
  if (prop.type === "relation") {
    return prop.relation.map((r) => r.id);
  }
  return [];
}

export function getFormulaValue(prop: PropertyValue): string | number | null {
  if (prop.type === "formula") {
    const f = prop.formula;
    if (f.type === "string") return f.string;
    if (f.type === "number") return f.number;
    if (f.type === "boolean") return f.boolean ? "true" : "false";
    if (f.type === "date") return f.date?.start ?? null;
  }
  return null;
}

export function getEmail(prop: PropertyValue): string {
  if (prop.type === "email") {
    return prop.email ?? "";
  }
  return "";
}

export function getPhoneNumber(prop: PropertyValue): string {
  if (prop.type === "phone_number") {
    return prop.phone_number ?? "";
  }
  return "";
}
