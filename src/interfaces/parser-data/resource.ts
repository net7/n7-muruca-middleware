export interface PreviewParent {
  title: string;
  description: string;
  image: any;
  classes: string;
  link: string;
}

export interface Author {
  role: string;
  author: {
    [a: string]: {
      name: string;
    };
  };
}

export interface ParsedData {
  title: string;
  sections: any;
}
