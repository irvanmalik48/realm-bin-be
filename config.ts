/**
 * This variable contains the configuration for the application.
 */
export const config = {
  /**
   * The environment of the application.
   * Set to "production" to silent logs.
   */
  environment: "development",

  /**
   * The port of the application.
   */
  port: 9944,

  /**
   * The length of the paste id.
   * Default is 5.
   */
  idLength: 5,

  /**
   * The domain regex for CORS.
   */
  corsDomainRegex: /.*irvanma\.eu\.org$/,

  /**
   * The prefix of the application.
   * Default is "v2". Set to undefined to disable.
   */
  prefix: "v2",

  /**
   * The maximum length of the paste.
   * Default is 1000000.
   */
  maxPasteLength: 1000000,

  /**
   * The maximum file size of the paste.
   * Notated in bytes.
   * Default is 1 MiB or 1048576 bytes.
   */
  maxFileSize: 1048576,

  /**
   * The folder to store file-based pastes.
   * Default is "/opt/pastes".
   * Please make sure the folder exists, the folder is
   * read-writeable by the user running the application,
   * otherwise the application will crash.
   */
  defaultPasteFolder: "/opt/pastes",
};
