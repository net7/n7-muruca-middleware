import { DataType } from "../interfaces/helper";
import * as ASHelper from "../helpers/advanced-helper";
import { HttpHelper } from "../helpers";
import { Client } from "@elastic/elasticsearch";
import { ResourceParser } from "../parsers";
import { idText } from "typescript";
import * as sortObj from "sort-object";

export class GetResourceService {
  buildResource = async (body: any, data: any, conf: any) => {
    const { parsers, configurations } = conf;
    let { type, sections } = body;
    const parser = new parsers.resource();
    let response = parser.parse({
      data,
      options: {
        type,
        conf: configurations.resources[type],
      },
    });
    const sect = sortObj(response.sections, sections);
    // body sections filters
    response.sections = sect;

    if (data.locale) {
      const parseLang = new ResourceParser();
      response.locale = parseLang.localeParse(data.locale);
    }
    return response;

  };
  getResource = async (body: any, conf: any, locale: string) => {
    const { type, id } = body;
    const { baseUrl } = conf;
    const url = baseUrl + type + "/" + id;
    const path = locale ? "?lang=" + locale : "";
    const data = JSON.parse(await HttpHelper.doRequest(url + path));

    return data;
  };
}
