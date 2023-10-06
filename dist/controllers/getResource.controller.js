"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResourceController = void 0;
const services_1 = require("../services");
class getResourceController {
    constructor() {
        this.searchResource = (body, config, locale) => __awaiter(this, void 0, void 0, function* () {
            const service = new services_1.GetResourceService();
            const response = yield service.getResource(body, config, locale);
            var result = service.buildResource(body, response, config, locale);
            return result;
        });
    }
}
exports.getResourceController = getResourceController;
