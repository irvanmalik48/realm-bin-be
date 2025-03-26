export const config = {
  /**
   * @var environment
   * -----------------------------------------------------
   * The environment of the application.
   * Set to "production" to silent logs.
   */
  environment: "development",

  /**
   * @var port
   * -----------------------------------------------------
   * The port of the application.
   */
  port: 9944,

  /**
   * @var idLength
   * -----------------------------------------------------
   * The length of the paste id.
   * Default is 5.
   */
  idLength: 5,

  /**
   * @var corsDomainRegex
   * -----------------------------------------------------
   * The domain regex for CORS.
   */
  corsDomainRegex: /.*irvanma\.eu\.org$/,

  /**
   * @var prefix
   * -----------------------------------------------------
   * The prefix of the application.
   * Default is "v2". Set to undefined to disable.
   */
  prefix: "v2",

  /**
   * @var maxPasteLength
   * -----------------------------------------------------
   * The maximum length of the paste.
   * Default is 1000000.
   */
  maxPasteLength: 1000000,

  /**
   * @var maxFileSize
   * -----------------------------------------------------
   * The maximum file size of the paste.
   * Notated in bytes.
   * Default is 1 MiB or 1048576 bytes.
   */
  maxFileSize: 1048576,

  /**
   * @var Paste Folder
   * -----------------------------------------------------
   * The folder to store file-based pastes.
   * Default is "/opt/pastes".
   * Please make sure the folder exists, the folder is
   * read-writeable by the user running the application,
   * otherwise the application will crash.
   */
  defaultPasteFolder: "/opt/pastes",
};
