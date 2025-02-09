import { Dispatch, SetStateAction } from "react";
import { WikiverseServiceResponse } from "../../contexts";
import { Vertex } from "../data/vertex";
import { LayoutConfig } from "../data/layout-config";
import { Graphset } from "../data/graphset";

/**
 * Used to synchronize the external update for React's state for on-screen elements which need details emitted from the Sketch itself, and also control elements of the sketch at the same time
 */
export class ManagedState {
  //* Initiating Search
  private curQuery = "";
  private reactCurQuerySubscribers: Dispatch<SetStateAction<string>>[] = [];

  //* Currently Hovered
  private hovered: Vertex | null = null;
  private reactHoveredSubscribers: Dispatch<SetStateAction<Vertex | null>>[] =
    [];

  //* Currently Selected
  private selected: Vertex | null = null;
  private reactSelectedSubscribers: Dispatch<SetStateAction<Vertex | null>>[] =
    [];

  //* Boolean/Toggle-able Settings
  private clickToFetch = false;
  private reactClickToFetchSubscribers: Dispatch<SetStateAction<boolean>>[] =
    [];

  //* Rendered by p5.js => checkbox controlled
  private boundingBox = false;
  private axisOrientation = false;

  //* Rendered by React => checkbox & keyboard [,] controlled
  private sketchDetailsSummary = false;
  private reactShowSketchSummarySubscribers: Dispatch<
    SetStateAction<boolean>
  >[] = [];

  //* Mouse Sensitivity Settings
  private xSens = 2;
  private ySens = 2;
  private zSens = 1;

  //* Layout Value Settings
  private attrMult = 0;
  private repMult = 0;
  private density = 0;

  //* Sketch Details Summary Values
  private topics = 0;
  private reactTopicCountSubscribers: Dispatch<SetStateAction<number>>[] = [];
  private statements = 0;
  private reactStatementCountSubscribers: Dispatch<SetStateAction<number>>[] =
    [];

  //* Boolean ShowHide Settings Activity
  private showSettings = false;
  private reactShowSettingsSubscribers: Dispatch<SetStateAction<boolean>>[] =
    [];

  //* Tutorial Related State
  private tutorialNavMsg = "";
  private reactTutorialNavMsgSubscribers: Dispatch<SetStateAction<string>>[] =
    [];
  private tutorialBodyMsg = "";
  private reactTutorialBodyMsgSubscribers: Dispatch<SetStateAction<string>>[] =
    [];
  private tutorialInstructionMsg = "";
  private reactTutorialInstructionMsgSubscribers: Dispatch<
    SetStateAction<string>
  >[] = [];

  //* CONSTRUCTOR START
  //* CONSTRUCTOR START
  //* CONSTRUCTOR START

  constructor(initSketchData: WikiverseServiceResponse | null) {
    if (initSketchData) {
      this.curQuery = initSketchData.query;
      this.attrMult = initSketchData.layoutConfig.attractionMult;
      this.repMult = initSketchData.layoutConfig.repulsionMult;
      this.density = initSketchData.layoutConfig.dataDensity;
      this.selectOriginOnInit(initSketchData);
    }
  }

  /**
   * @method QUERY() - the original search term for the sketch
   */
  query() {
    return this.curQuery;
  }

  setQuery(query: string) {
    this.curQuery = query;
    this.reactCurQuerySubscribers.forEach(subscription => subscription(query));
  }

  addQuerySubscriber(setter: Dispatch<SetStateAction<string>>) {
    this.reactCurQuerySubscribers.push(setter);
  }

  /**
   * @method CURRENTLY_HOVERED() - the topic the user is currently hovering
   */
  curHovered() {
    return this.hovered;
  }

  setCurHovered(vert: Vertex | null) {
    this.hovered = vert;
    this.reactHoveredSubscribers.forEach(subscription => subscription(vert));
  }

  addCurHoveredSubscriber(setter: Dispatch<SetStateAction<Vertex | null>>) {
    this.reactHoveredSubscribers.push(setter);
  }

  /**
   * @method CURRENTLY_SELECTED() - the topic the user has currently selected
   */
  curSelected() {
    return this.selected;
  }

  setCurSelected(vert: Vertex | null) {
    this.selected = vert;
    this.reactSelectedSubscribers.forEach(subscription => subscription(vert));
  }

  addCurSelectedSubscriber(setter: Dispatch<SetStateAction<Vertex | null>>) {
    this.reactSelectedSubscribers.push(setter);
  }

  /**
   * @method trickCurSelectedUpdate() - called after service responses containing new data to alert curSelected subscribers which derive state from that w/o deselecting...
   */
  trickCurSelectedUpdate() {
    const curSelected = this.curSelected();
    curSelected && this.setCurSelected(new Vertex(curSelected));
  }

  //* ON SCREEN DISPLAY SETTINGS TOGGLES
  //* ON SCREEN DISPLAY SETTINGS TOGGLES
  //* ON SCREEN DISPLAY SETTINGS TOGGLES

  /**
   * @method CLICK_TO_FETCH() - toggle sending a fetch request for more data when clicking on a Vertex
   */
  clickToFetchEnabled() {
    return this.clickToFetch;
  }

  toggleClickToFetch() {
    const orig = this.clickToFetch;
    this.clickToFetch = !orig;
    this.reactClickToFetchSubscribers.forEach(subscription =>
      subscription(!orig)
    );
  }

  addClickToFetchSubscriber(setter: Dispatch<SetStateAction<boolean>>) {
    this.reactClickToFetchSubscribers.push(setter);
  }

  /**
   * @method SHOW_BOUNDING_BOX() - bounding box frame drawn on-screen to locate sketch in space better.
   */
  showBoundingBox() {
    return this.boundingBox;
  }

  toggleShowBoundingBox() {
    const original = this.boundingBox;
    this.boundingBox = !original;
  }

  /**
   * @method SHOW_AXIS_ORIENTATION() - typical R:X G:Y B:Z directional indicator drawn on screen to locate orientation
   */
  showAxisOrientation() {
    return this.axisOrientation;
  }

  toggleShowAxisOrientation() {
    const original = this.axisOrientation;
    this.axisOrientation = !original;
  }

  /**
   * @method SHOW_GRAPH_STATISTICS() - display the on-screen summary of the current Graphset and Camera positions
   */
  showSketchDetailsSummary() {
    return this.sketchDetailsSummary;
  }

  toggleShowSketchDetailsSummary() {
    const orig = this.sketchDetailsSummary;
    this.sketchDetailsSummary = !orig;
    this.reactShowSketchSummarySubscribers.forEach(subscription =>
      subscription(!orig)
    );
  }

  addShowSketchDetailsSummarySubscriber(
    setter: Dispatch<SetStateAction<boolean>>
  ) {
    this.reactShowSketchSummarySubscribers.push(setter);
  }

  showSketchSettings() {
    return this.showSettings;
  }

  toggleShowSketchSettings() {
    const orig = this.showSettings;
    this.showSettings = !orig;
    this.reactShowSettingsSubscribers.forEach(subscription =>
      subscription(!orig)
    );
  }

  addshowSketchsettingsSubscriber(setter: Dispatch<SetStateAction<boolean>>) {
    this.reactShowSettingsSubscribers.push(setter);
  }

  //* MOUSE VALUES SETTINGS
  //* MOUSE VALUES SETTINGS
  //* MOUSE VALUES SETTINGS

  /**
   * @method X_AXIS
   */
  xMouseSens() {
    return this.xSens;
  }

  setXMouseSens(val: number) {
    this.xSens = val;
  }

  /**
   * @method Y_AXIS
   */
  yMouseSens() {
    return this.ySens;
  }

  setYMouseSens(val: number) {
    this.ySens = val;
  }

  /**
   * @method Z_AXIS
   */
  zMouseSens() {
    return this.zSens;
  }

  setZMouseSens(val: number) {
    this.zSens = val;
  }

  //* LAYOUT VALUES SETTING
  //* LAYOUT VALUES SETTING
  //* LAYOUT VALUES SETTING

  /**
   * @method ATTRACTION() - how much related Vertices pull towards each other
   */
  attractionMult() {
    return this.attrMult;
  }

  setAttractionMult(mult: number) {
    this.attrMult = mult;
  }

  /**
   * @method REPULSION() - how much related ALL vertices push off from one another
   */
  repulsionMult() {
    return this.repMult;
  }

  setRepulsionMult(mult: number) {
    this.repMult = mult;
  }

  /**
   * @method DENSITY() - overall size allotted for the sketch itself
   */
  dataDensity() {
    return this.density;
  }

  setDataDensity(dens: number) {
    this.density = dens;
  }

  layoutConfig(): LayoutConfig {
    return new LayoutConfig().updateConfigValues(
      this.dataDensity(),
      this.attractionMult(),
      this.repulsionMult()
    );
  }

  //* SKETCH DETSILS SUMMARRY VALUES
  //* SKETCH DETSILS SUMMARRY VALUES
  //* SKETCH DETSILS SUMMARRY VALUES

  /**
   * @method TOPIC_COUNT() - number of total Vertices in the Graphset
   */
  topicCount() {
    return this.topics;
  }

  setTopicCount(count: number) {
    this.topics = count;
    this.reactTopicCountSubscribers.forEach(subscription =>
      subscription(count)
    );
  }

  addTopicCountSubscriber(setter: Dispatch<SetStateAction<number>>) {
    this.reactTopicCountSubscribers.push(setter);
  }

  /**
   * @method STATEMENT_COUNT() - number of total edges in the Graphset
   */
  statementCount() {
    return this.statements;
  }

  setStatementCount(count: number) {
    this.statements = count;
    this.reactStatementCountSubscribers.forEach(subscription =>
      subscription(count)
    );
  }

  addStatementCountSubscriber(setter: Dispatch<SetStateAction<number>>) {
    this.reactStatementCountSubscribers.push(setter);
  }

  updateCountTotals(graph: Graphset) {
    //? HELPER ? to call both updates @ once
    this.setTopicCount(graph.vertices.length);
    this.setStatementCount(graph.edges.length);
  }

  //* TUTORIAL RELATED STATE
  //* TUTORIAL RELATED STATE
  //* TUTORIAL RELATED STATE

  /**
   * @method updateTutorialState() - helper to call and update all of the set methods inside of the tutorial subGroup of managed state, to update them all in parallel.
   */
  updateTutorialState(apiResponse: WikiverseServiceResponse | null) {
    if (!apiResponse) return;

    const subStrings = apiResponse.query.split("::");
    if (subStrings.length) {
      this.setTutorialNav(subStrings[0]);
      this.setTutorialBody(subStrings[1]);
      this.setTutorialInstruction(subStrings[2]);
    }
  }

  tutorialNav() {
    return this.tutorialNavMsg;
  }

  setTutorialNav(navMsg: string) {
    this.tutorialNavMsg = navMsg;
    this.reactTutorialNavMsgSubscribers.forEach(subscription =>
      subscription(navMsg)
    );
  }

  addTutorialNavSubscriber(setter: Dispatch<SetStateAction<string>>) {
    this.reactTutorialNavMsgSubscribers.push(setter);
  }

  tutorialBody() {
    return this.tutorialBodyMsg;
  }

  setTutorialBody(bodyMsg: string) {
    this.tutorialBodyMsg = bodyMsg;
    this.reactTutorialBodyMsgSubscribers.forEach(subscription =>
      subscription(bodyMsg)
    );
  }

  addTutorialBodySubscriber(setter: Dispatch<SetStateAction<string>>) {
    this.reactTutorialBodyMsgSubscribers.push(setter);
  }

  tutorialInstruction() {
    return this.tutorialInstructionMsg;
  }

  setTutorialInstruction(instructionMsg: string) {
    this.tutorialInstructionMsg = instructionMsg;
    this.reactTutorialInstructionMsgSubscribers.forEach(subscription =>
      subscription(instructionMsg)
    );
  }

  addTutorialInstructionSubscriber(setter: Dispatch<SetStateAction<string>>) {
    this.reactTutorialInstructionMsgSubscribers.push(setter);
  }

  //* PRIVATE METHODS
  //* PRIVATE METHODS
  //* PRIVATE METHODS

  /**
   * @method selectOriginOnInit() - called when data is present on obj initialization to select the origin (Vertex) for the client automatically
   */
  private selectOriginOnInit(initSketchData: WikiverseServiceResponse) {
    const originVertData =
      initSketchData.vertices.find(v => {
        if (v.origin) return v;
        if (v.label) {
          return (
            v.label.toLocaleLowerCase() === this.curQuery.toLocaleLowerCase()
          );
        }
      }) || null;

    if (!originVertData) return;
    this.setCurSelected(new Vertex(originVertData));
  }
}
