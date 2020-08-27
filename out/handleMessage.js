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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var fetch = require("node-fetch");
var getUsers = function () { return JSON.parse(fs.readFileSync('users.json', 'utf8')); };
var saveUsers = function (users) { return fs.writeFileSync('users.json', JSON.stringify(users)); };
var getGroups = function () { return JSON.parse(fs.readFileSync('groups.json', 'utf8')); };
var saveGroups = function (groups) { return fs.writeFileSync('groups.json', JSON.stringify(groups)); };
var restoreGroups = function () { return JSON.parse(fs.readFileSync('restore.json', 'utf8')); };
var langs = [
    'uz', 'ru', 'en', 'tr', 'es',
    'pt', 'it', 'id', 'vi', 'zh',
    'hi', 'de', 'fa', 'ko', 'ar',
    'uk', 'az', 'tg', 'fr', 'ky',
    'ms', 'nl', 'fil', 'ja', 'ml',
    'iw', 'bn', 'pl', 'kk', 'ig',
    'am', 'te', 'so'
];
var generateGroupsListToSend = function (groups) {
    var result = '';
    for (var g in groups) {
        result += +g + 1 + ". @" + groups[g].u + " - " + groups[g].t + "\n";
    }
    return {
        source: Buffer.from(result),
        filename: groups.length.toString() + '.txt'
    };
};
var generateUsernamesListToSend = function (groups) {
    var result = '';
    for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
        var group = groups_1[_i];
        result += '@' + group.u + '\n';
    }
    return {
        source: Buffer.from(result),
        filename: groups.length.toString() + '.txt'
    };
};
var parseGroups = function () { return __awaiter(void 0, void 0, void 0, function () {
    var req, html, splitted, lineInHtmlDocument, groups, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch('https://combot.org/telegram/top/groups?lng=all&page=3')];
            case 1:
                req = _a.sent();
                return [4 /*yield*/, req.text()];
            case 2:
                html = _a.sent();
                splitted = html.split('\n');
                lineInHtmlDocument = splitted.find(function (line) { return line.includes('var topchats'); });
                groups = lineInHtmlDocument.slice(15, lineInHtmlDocument.length - 1);
                return [2 /*return*/, JSON.parse(groups)];
            case 3:
                e_1 = _a.sent();
                console.log(e_1);
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports["default"] = (function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, command, args, groups, result, lang_1, result, lang_2, users, users, users, reply_text, u;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!ctx.message.text)
                    return [2 /*return*/];
                _a = ctx.message.text.split(' '), command = _a[0], args = _a.slice(1);
                console.log(command, args);
                groups = getGroups();
                if (!(command == '/get')) return [3 /*break*/, 5];
                if (!(!args.length || args[0] == 'all')) return [3 /*break*/, 2];
                result = '';
                return [4 /*yield*/, ctx.replyWithDocument(generateGroupsListToSend(groups))];
            case 1:
                _b.sent();
                return [3 /*break*/, 4];
            case 2:
                lang_1 = '';
                if (langs.includes(args[args.length - 1].toLowerCase())) {
                    lang_1 = args[args.length - 1];
                    args = args.slice(0, args.length - 1);
                }
                groups = groups.filter(function (g) { return (g.t.includes(args.join(' ')) || g.u.includes(args.join(' '))) && (lang_1 ? g.l.toLowerCase() == lang_1.toLowerCase() : true); });
                return [4 /*yield*/, ctx.replyWithDocument(generateGroupsListToSend(groups))];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4: return [3 /*break*/, 32];
            case 5:
                if (!(command.toLowerCase() == '/getusernames')) return [3 /*break*/, 10];
                if (!(!args.length || args[0] == 'all')) return [3 /*break*/, 7];
                result = '';
                return [4 /*yield*/, ctx.replyWithDocument(generateUsernamesListToSend(groups))];
            case 6:
                _b.sent();
                return [3 /*break*/, 9];
            case 7:
                lang_2 = '';
                if (langs.includes(args[args.length - 1].toLowerCase())) {
                    lang_2 = args[args.length - 1];
                    args = args.slice(0, args.length - 1);
                }
                groups = groups.filter(function (g) { return (g.t.includes(args.join(' ')) || g.u.includes(args.join(' '))) && (lang_2 ? g.l.toLowerCase() == lang_2.toLowerCase() : true); });
                return [4 /*yield*/, ctx.replyWithDocument(generateUsernamesListToSend(groups))];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9: return [3 /*break*/, 32];
            case 10:
                if (!(command == '/update')) return [3 /*break*/, 16];
                return [4 /*yield*/, parseGroups()];
            case 11:
                groups = _b.sent();
                if (!groups) return [3 /*break*/, 13];
                saveGroups(groups);
                return [4 /*yield*/, ctx.replyWithDocument(generateGroupsListToSend(groups))];
            case 12:
                _b.sent();
                return [3 /*break*/, 15];
            case 13: return [4 /*yield*/, ctx.reply('❌ Произошла ошибка во время обновления базы')];
            case 14:
                _b.sent();
                _b.label = 15;
            case 15: return [3 /*break*/, 32];
            case 16:
                if (!(command == '/restore')) return [3 /*break*/, 18];
                groups = restoreGroups();
                saveGroups(groups);
                return [4 /*yield*/, ctx.replyWithDocument(generateGroupsListToSend(groups))];
            case 17:
                _b.sent();
                return [3 /*break*/, 32];
            case 18:
                if (!(command.toLowerCase() == '/adduser')) return [3 /*break*/, 24];
                if (!!args.length) return [3 /*break*/, 19];
                ctx.reply('❌ Вы не указали username пользователя');
                return [3 /*break*/, 23];
            case 19:
                users = getUsers();
                if (!users.includes(args[0])) return [3 /*break*/, 21];
                return [4 /*yield*/, ctx.reply('❌ Этот пользователь уже добавлен')];
            case 20:
                _b.sent();
                return [3 /*break*/, 23];
            case 21:
                users.push(args[0]);
                saveUsers(users);
                return [4 /*yield*/, ctx.reply('✅ Пользователь добавлен')];
            case 22:
                _b.sent();
                _b.label = 23;
            case 23: return [3 /*break*/, 32];
            case 24:
                if (!(command.toLowerCase() == '/removeuser')) return [3 /*break*/, 30];
                if (!!args.length) return [3 /*break*/, 25];
                ctx.reply('❌ Вы не указали username пользователя');
                return [3 /*break*/, 29];
            case 25:
                users = getUsers();
                if (!!users.includes(args[0])) return [3 /*break*/, 27];
                return [4 /*yield*/, ctx.reply('❌ Этот пользователь не был добавлен ранее')];
            case 26:
                _b.sent();
                return [3 /*break*/, 29];
            case 27:
                users = users.filter(function (u) { return u.toLowerCase() != args[0].toLowerCase(); });
                saveUsers(users);
                return [4 /*yield*/, ctx.reply('✅ Пользователь удалён')];
            case 28:
                _b.sent();
                _b.label = 29;
            case 29: return [3 /*break*/, 32];
            case 30:
                if (!(command.toLowerCase() == '/listusers')) return [3 /*break*/, 32];
                users = getUsers();
                reply_text = '';
                if (users.length) {
                    for (u in users) {
                        reply_text += +u + 1 + ". @" + users[u] + "\n";
                    }
                }
                else {
                    reply_text = '❌ Нет пользователей';
                }
                return [4 /*yield*/, ctx.reply(reply_text)];
            case 31:
                _b.sent();
                _b.label = 32;
            case 32: return [2 /*return*/];
        }
    });
}); });
