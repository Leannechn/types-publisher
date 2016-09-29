"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fsp = require("fs-promise");
const path = require("path");
const common_1 = require("./common");
const util_1 = require("./util");
/** Logger that *just* outputs to the console and does not save anything. */
exports.consoleLogger = {
    info: console.log,
    error: console.error
};
/** Logger that *just* records writes and does not output to console. */
function quietLogger() {
    const logged = [];
    return [(message) => logged.push(message), () => logged];
}
exports.quietLogger = quietLogger;
/** Performs a side-effect and also records all logs. */
function alsoConsoleLogger(consoleLog) {
    const [log, logResult] = quietLogger();
    return [
            (message) => {
            consoleLog(message);
            log(message);
        },
        logResult
    ];
}
/** Logger that writes to console in addition to recording a result. */
function logger() {
    return alsoConsoleLogger(console.log);
}
exports.logger = logger;
/** Helper for creating `info` and `error` loggers together. */
function loggerWithErrorsHelper(logger) {
    const [info, infoResult] = logger();
    const [error, errorResult] = logger();
    return [
        { info, error },
            () => ({ infos: infoResult(), errors: errorResult() })
    ];
}
/** Records `info` and `error` messages without writing to console. */
function quietLoggerWithErrors() {
    return loggerWithErrorsHelper(quietLogger);
}
exports.quietLoggerWithErrors = quietLoggerWithErrors;
/** Records `info` and `error` messages, calling appropriate console methods as well. */
function loggerWithErrors() {
    return loggerWithErrorsHelper(logger);
}
exports.loggerWithErrors = loggerWithErrors;
/**
 * Move everything from one Log to another logger.
 * This is useful for performing several tasks in parallel, but outputting their logs in sequence.
 */
function moveLogs(dest, src, mapper) {
    for (const line of src) {
        dest(mapper ? mapper(line) : line);
    }
}
exports.moveLogs = moveLogs;
/** Perform `moveLogs` for both parts of a LogWithErrors. */
function moveLogsWithErrors(dest, { infos, errors }) {
    moveLogs(dest.info, infos);
    moveLogs(dest.error, errors);
}
exports.moveLogsWithErrors = moveLogsWithErrors;
const logDir = path.join(common_1.home, "logs");
function logPath(logName) {
    return path.join(logDir, logName);
}
exports.logPath = logPath;
function writeLog(logName, contents) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fsp.ensureDir(logDir);
        yield util_1.writeFile(logPath(logName), contents.join("\r\n"));
    });
}
exports.writeLog = writeLog;
function joinLogWithErrors({ infos, errors }) {
    return errors.length ? infos.concat(["", "=== ERRORS ===", ""], errors) : infos;
}
exports.joinLogWithErrors = joinLogWithErrors;
//# sourceMappingURL=logging.js.map