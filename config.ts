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
};
