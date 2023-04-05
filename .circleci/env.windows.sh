####################################################################################################
# Decrypt GCP Credentials and store them as the Google default credentials.
####################################################################################################
mkdir -p "${APPDATA}/gcloud/";
openssl aes-256-cbc -d -in "${PROJECT_ROOT}/.circleci/gcp_token" \
        -md md5 -k "$CIRCLE_PROJECT_REPONAME" -out "${APPDATA}/gcloud/application_default_credentials.json"

####################################################################################################
# Set bazel configuration for CircleCI runs.
####################################################################################################
cp "${PROJECT_ROOT}/.circleci/bazel.windows.rc" "${USERPROFILE}/.bazelrc";

# Override the `PATH` environment variable so that the windows-nvm NodeJS version
# always has precedence over potential existing NodeJS versions from the image.
setPublicVar PATH "/c/Program Files/nodejs/:$PATH"

# Expose the Bazelisk version. We need to run Bazelisk globally since Windows has problems launching
# Bazel from a node modules directoy that might be modified by the Bazel Yarn install then.
setPublicVar BAZELISK_VERSION \
    "$(cd ${PROJECT_ROOT}; node -p 'require("./package.json").devDependencies["@bazel/bazelisk"]')"
