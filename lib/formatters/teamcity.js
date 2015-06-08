/**
 * @fileoverview TeamCity Service Message Reporter
 * @author Mark Reynolds
 */
"use strict";

var xmlescape = require("xml-escape");

module.exports = function(results) {

    var output = "";

    output += "##teamcity[testSuiteStarted name='ESLint']\n";

    results.forEach(function(result) {

        var messages = result.messages;

        output += "##teamcity[testStarted name='" + result.filePath + "']\n";

        messages.forEach(function(message) {

            var details = "";

            details += "Message: " + xmlescape(message.message || "");
            details += ", File: " + result.filePath;
            details += ", Line: " + (message.line || 0);
            details += ", Col: " + (message.column || 0);

            output += "##teamcity[testFailed";
            output += " name='" + message.ruleId + "'";
            output += " message='" + xmlescape(message.message || "") + "'";
            output += " details='" + details + "'";
            output += "]\n";
        });

        output += '##teamcity[testFinished name=\'' + result.filePath + '\']\n';

    });

    output += "##teamcity[testSuiteFinished name='ESLint']\n";

    return output;
};
