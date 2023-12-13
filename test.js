import artifact from "@actions/artifact";

console.info("Default export:");
console.info(artifact);

console.info("-".repeat(20));

console.info("The real default exported value is the `default` property:");
console.info(artifact.default);

console.info("-".repeat(20));

console.info("The `uploadArtifact` method is only accessible in the `default` property:");
console.info("`artifact.uploadArtifact`:", artifact.uploadArtifact);
console.info("`artifact.default.uploadArtifact`:", artifact.default.uploadArtifact);
