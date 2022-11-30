export interface Comparison {

  /**
   * @description Comparison interface should be implemented in entities used in object comparison
   */

  isEqual(value: any): boolean;

}
