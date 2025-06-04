declare global {
    interface String {
        removeBefore(substring: string): string;
        capitalizeFirst(): string;
    }
}

String.prototype.removeBefore = function (substring: string): string {
    const index = this.indexOf(substring);
    return index === -1 ? this.toString() : this.slice(index + substring.length);
};

String.prototype.capitalizeFirst = function (): string {
    return this.length === 0
        ? this.toString()
        : this.charAt(0).toUpperCase() + this.slice(1);
};

// You MUST export something to make this a module
export {}; // 👈 This line is essential!