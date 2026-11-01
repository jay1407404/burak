# BURAK project learning diagrams

Eight separate images explaining the sections of this project. Read them in numbered order.

Generated with the built-in image_gen tool. Prompts and correction prompts are saved in [prompts.json](prompts.json).

| Image | Section |
|---|---|
| [01](01-startup.png) | Starting the app |
| [02](02-controllers.png) | Controllers |
| [03](03-services.png) | Services |
| [04](04-schemas.png) | Schemas and MongoDB rules |
| [05](05-shared-types.png) | Shared types and helpers |
| [06](06-ejs-pages.png) | EJS pages |
| [07](07-browser-files.png) | Browser files |
| [08](08-uploads-storage.png) | Uploads and storage |

The page sketches and sample database document are simplified illustrations, not screenshots or exact database records. Actual product image paths use productImages (an array); the account image field is memberImage. An example product image path is uploads/products/example.png.

The controllers diagram shows responses returning from the controller to the browser. The service performs the requested database operation.

These diagrams describe the current folder structure. The app serves public/, and src/public/ is a separate copy. The users page contains status dropdowns, but the served users.js does not implement their updates yet.

Open [index.html](index.html) for an image gallery.
