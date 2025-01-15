<h1 align=center>the Wikiverse</h1>
<ul align=center>
  <h2>
    <a href=https://github.com/horaciovelvetine/wikidata-universe-client>Frontend</a> |
    <a href=https://github.com/horaciovelvetine/wikidata-universe-api>Backend</a> |
    <a href=https://github.com/horaciovelvetine/horaciovelvetine/blob/main/assets/docs/THE_WIKIVERSE_OVERVIEW.md>Documentation & Resources </a>
  </h2>
</ul>

<h2 align=center>The Wikiverse is a web app (and API) that allows you to search Wikidata and explore topics in 3D space. Leveraging Wikidata's publically available tools and api for data, the Wikiverse dynamically generates a graph of the result and it's related topics. This project is currently in Alpha and serves exclusively as an educational project started by the question 'What would wikipedia look like in 3D space?'</h2>

<img align=center src=.github/readme_assets/wikipedia_in3D_v0.0.1.png>
<p align=center>This is what Wikipedia looks like in 3D space, just to get that answer out of the way</p>  

<h4>Special attention has been taken throughout the development process to ensure any learning opportunity encountered was well documented. The <a href=https://github.com/horaciovelvetine/horaciovelvetine/blob/main/assets/docs/THE_WIKIVERSE_OVERVIEW.md>Documentation & Resources</a> section includes links to additional write-ups, copies of reference material, links to code, sample & pseudo code, and a record of the complete prototyping process from question to deploy</h4>

## `main` Azure Deployment

<h4>This branch uses the action defined @ 'github/workflows/main_wikiverse_azure_deploy.yml' to build, stage and deploy this project. Any commits/changes made to the main branch will be pushed live on sync. </h4>

- The action runs `npm install` prior to building, including the package-lock.json will prevent the VM from installing the needed dependencies, which fill fail the build step (< 2min. typically), ensure any local lock files are not committed to main. The node.js convention is added to the .gitignore for this purpose.

- The `src/app/contexts/wikiverse-service-provider.ts` includes a prop boolean to use either a locally running version of the API or the Azure Deployed endpoint. For any development ensure you are using a locally running version of the API. 

  - Clone and Run <a href='https://github.com/horaciovelvetine/wikidata-universe-api'>this companion API</a>
  - Ensure the `useLocalAPI()` variable is correctly (true) passed to make requests to the local deployment of the API, and that the local API url matches the default port used by Tomcat.

## `staging` Integration & Prep

<h4>The `staging` branch is intended to finalize which commits will be pulled into main, and is used to test changes against the actively deployed api to ensure frontend changes gel with the API and will not cause issues.</h4>

- Ensure props passed to the `src/app/contexts/wikiverse-service-provider.ts` are restored/discared before committs are made to the `main` branch.

## `v0.0.2` (current) Alpha

<img align=center src=.github/readme_assets/kb_ver0.0.2_demo.png>

<h3>Goal: Refactor app from ground up to make the UI resizeable and iron out code orginization and clarity.</h3>

- **Resizeable UI & Layout:** Components are now better suited for a multitude of screen sizes and include a minimum screen cutoff and message when a client's device is of a particularly small. These changes effect the entire application including movnig the secondary search input and Sketch Summary up to the Navbar to maximize effective screen size.
- **React & Refactor:** Considerable time was spent reading and learning from a variety of sources to try to better understand, leverage, and follow conventions and tools in the react Ecosystem. Additional state tools were considered ([TanStack](https://tanstack.com/) & [ZuStand](https://github.com/pmndrs/zustand)) but for now the Context API and React state have been coupled with the [Managed State]('src/types/sketch/managed-state.ts') class to maintain the state-us quo. 
  - [React Docs](https://react.dev/)
  - [first: React Handbook Fundamentals](https://reacthandbook.dev/fundamentals)
  - [then: React Handbook](https://reacthandbook.dev/)
  - [Bullet Proof React](https://github.com/alan2207/bulletproof-react)
  - [FCC: React Context API](https://www.freecodecamp.org/news/react-context-api-explained-with-examples/)

- **Animate Position Updating:** using the update positions button in the settings menu now animates all the topics in the scene to allow them to 'fly' to their new position in the sketch in a pleasing way which isn't so visually suddent and disjarring.
-  **Additional Settings:** added mouse sensitvity 

## `v0.0.1` Alpha

<img align=center src=.github/readme_assets/kb_ver0.0.1_demo.png>

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