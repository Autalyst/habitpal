// Add support for JSON serialization of bigint
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};