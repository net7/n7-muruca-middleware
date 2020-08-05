/**
 * Interface for the Resources component
 */
export interface ResourceData {
  title: string;
  sections: any;
}

/**
* Interface for the Metadata component
*/
export interface ResourceMetadata {
   group: {
       title: string;
       items: {
           label: string;
           value: string;
       }[];
   }[];
}

/**
* Interface for the Header component
*/
export interface ResourceHeader {
   title: string;
}

/**
* Interface for the Collection component
*/
export interface ResourceCollection {
   header: {
       title: string;
   },
   items: {
       title: string;
       link?: string;
       type?: string;
   }[]
}

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
