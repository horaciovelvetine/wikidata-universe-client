<h1 align=center>the Wikiverse</h1>
<ul align=center>
  <h2>
    <a href=https://github.com/horaciovelvetine/wikidata-universe-client>Frontend</a> |
    <a href=https://github.com/horaciovelvetine/wikidata-universe-api>Backend</a> |
    <a href=#Documentation-&-Resources>Documentation & Resources </a>
  </h2>
</ul>

<h2 align=center>The Wikiverse is a web app (and API) that allows you to search Wikidata and explore topics in 3D space. Leveraging Wikidata's publically available tools and api for data, the Wikiverse dynamically generates a graph of the result and it's related topics. This project is currently in Alpha and serves exclusively as an educational project started by the question 'What would wikipedia look like in 3D space?'</h2>

<img align=center src=.github/readme_assests/wikipedia_in3D_v0.0.1.png>
<p align=center>This is what Wikipedia looks like in 3D space, just to get that answer out of the way</p>  

<h4>Special attention has been taken throughout the development process to ensure any learning opportunity encountered was well documented. The <a href=#Documentation-&-Resources>Documentation & Resources</a> section includes links to additional write-ups, copies of reference material, links to code, sample & pseudo code, and a record of the complete prototyping process from question to deploy</h4>

## `main` Azure Deployment

<h4>This branch uses the action defined @ 'github/workflows/main_wikiverse_azure_deploy.yml' to build, stage and deploy this project. Any commits/changes made to the main branch will be pushed live on sync. </h4>

- The action runs `npm install` prior to building, including the package-lock.json will prevent the VM from installing the needed dependencies, which fill fail the build step (< 2min. typically), ensure any local lock files are not committed. The node.js convention is added to the .gitignore for this purpose.

- The `src/api/util/ApiUrl.ts` function includes a boolean to use either a locally running version of the API or the Azure Deployed endpoint. For any development ensure you are using a locally running version of the API. 

  - Clone and Run <a href='https://github.com/horaciovelvetine/wikidata-universe-api'>this companion API</a>
  - Ensure the `apiURL()` call is correctly setup to make requests to the local deployment of the API, and that the local API url matches the default port used by Tomcat.

## `staging` Integration & Prep

<h4>The `staging` branch is intended to finalize which commits will be pulled into main, and is used to test changes against the actively deployed api to ensure frontend changes gel with the API and will not cause issues.</h4>

- Ensure changes inside the `src/api/util/ApiUrl.ts` are restored/discared in favor of the current commit of this method deployed on the `main` branch.

## `v0.0.1` (Current) Alpha

<img align=center src=.github/readme_assests/kb_ver0.0.1_demo.png>

<h3>Goal: Present a simple and intuitive UI which allows the User to search existing Wikidata and explore the results in a liminal 3D space using a Mouse and Keyboard. Display identifying information about a given topic in a meaningful way which encourages exploring a topic in a wider context and fosters natural discovery.</h3>

- **Offline & API Status Handling:** Displays a msg when the API is unavailable or otherwise offline which prevents any erroneous user interaction when the App will not work. 
- **Searching Wikidata:** Input validation & checking is delegated to API, input(s) shake on Error recieved from the API (either Offline or no matching results)
- **Wikiverse Sketch:** Establishes a visual 'style' focusing on simplicity and readability w/ Primary models for Vertices, Properties, and Edges stored inside a (borrowed from the API) Graphset. 
- **Selectable:** Vertices can be selected and deslected w/ cut_state being brodcast to React & P5 (sketch) effecting change concurrently with no known sync issues. Currently selected vertices are detailed in 'gold' to indicated the selection across the UI. Text information displayed about the currently selected vertex allows opening the Wikidata source page.
- **Hoverable:** As the cursor hovers a vertex, the identifying information is published in real time, cleaning up when unhovered
- **Drawing Relationships:** On hover & on select edges (rays) connecting vertices are drawn in the directional color to indicate a basic flow for relationships between vertices inside the wikiverse
- **Listing Relationships:** On select lists all the edges connecting the currently selected vertex and any other vertices in the current sketch. Clicking inside this list has several outcomes: clicking the source vertex icon focuses the camera towards this vertex, clicking the property opens the source Wikidata page, and clicking the target vertex focuses the camera instead on this vertex. The List component has ended up being the easiest way to 'jump around' a sketch quickly.
- **Initial 'Settings':** Provides an initial implementation of some settings which gives the user control of two key settings areas: in the sketch itself (the UI), and in the layout process (api and experimental for MVP).

  - **Sketch (UI) Settings:** 

    - **Bounding Box Toggling** - provides walls for the garden of the sketch, providing visual indicatiors of the current 'size' of the data
    - **Axis Toggling** - provide a means of visually orienting the user against the 'center' (mean)  of the universe following 3D axis conventions (R:X, G:Y, Z:B)
    - **Sketch Summary** - provides the Vertex (topic) and Edge (statement) count and live positioning information for the camera's current position and focus 
  
  - **Layout (API) Settings:** Adjusts some constant values used in the layout algorithm which effect the way in which vertices are placed inside the Wikiverse.

    - **Attraction Mult** - How much related vertices pull on each other, effecting the nature of vertices to 'clump'
    - **Repulsion Mult** - How much each vertices pushes off of each other, effecting the size of the space around each vertex which no other vertex is likely to be positioned in
    - **Data Density** - How tightly packed of a space the overall sketch is packed into 

- **Camera Management:** The `CameraManager` is able to animate both the focus and position across a defined frame duration for smooth transitions between either
- **Tutorial:** Provides a step by step introduction to the Wikiverse and how to use the application. Details each of the current features and abstracts concepts to digestable chunks for any user. This includes using more convention freindly language where Vertex is Topic, and Edge is Statement. 
- **Dynamic Nav Bar:** Keeps track of what the user is currently doing, or exploring for any of the main 3 features: Explore, Tutorial, & Settings.  

## Documentation & Resources

