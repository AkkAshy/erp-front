// Attribute value type
export type AttributeValue = {
  id: number;
  attribute_type: number;
  value: string;
  slug: string;
  ordering: number;
};

export type AttributeType = {
  id: number;
  name: string;
  slug: string;
  is_filterable: boolean;
  values?: AttributeValue[];
};

export type AttributeTypeList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AttributeType[];
};

export type AttributeValueList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AttributeValue[];
};

export type CreateAttributeType = {
  name: string;
  slug?: string;
  is_filterable?: boolean;
};

export type CreateAttributeValue = {
  attribute_type: number;
  value: string;
  slug?: string;
  ordering?: number;
};

export type UpdateAttributeValue = Partial<CreateAttributeValue> & { id: number };
