import Parser, { Input } from "../interfaces/parser";
import { HeroData, CollectionData, CollectionHeaderData, CollectionItem } from "../interfaces/parser-data/home";
export declare class HomeParser implements Parser {
    parse(input: Input): object;
    protected parseHero(data: any, _: string): HeroData;
    protected parseCollection(data: any, block: string): CollectionData;
    protected parseCollectionHeader(data: any, _: string): CollectionHeaderData;
    protected parseCollectionItems(data: any, _: string): CollectionItem[];
}
