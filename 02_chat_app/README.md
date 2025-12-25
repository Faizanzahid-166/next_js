## (project name)

A simple and interactive Nexr.js react application demonstrating state management Blitz Chat-App ⚡ and Tailwind CSS styling.

## Project Description
1- what i learn in this project next/server in proxy.js that is new version of middleware. And also my confusion get  clear "use-client" and "use-server". 

2- In Next.js by default, components run on the server. We use "use client" when a component needs browser features   like React hooks (useState, useEffect).We use "use server" for secure server-only logic like database access, authentication, and form actions.

3-Also by defalt how create rootadmin and Next.js run on edge use the {(npm i jose)} instead of jsonwebtoken(jwt). How setup the scoket.io foe instant replay. It is used for conversation immediately replay.

4-A proper structure how set cookie, hashpassword using bcryptjs, zod validation. And how store info in getUserFromRequest. Making a JSON response with success and error used everywhere.

5- Use the react-redux/toolkit using for implementation of state and learn addcase reducer builder.


## Installation Instructions
npx create-next-app@latest

Follow these steps to run the project locally:                          
Would you like to use TypeScript? No / Yes                                    => optional
Which linter would you like to use? ESLint / Biome / None                     => ESLint
Would you like to use React Compiler? No / Yes                                => No
Would you like to use Tailwind CSS? No / Yes                                  => Yes
Would you like your code inside a `src/` directory? No / Yes                  => Yes
Would you like to use App Router? (recommended) No / Yes                      => Yes
Would you like to customize the import alias (`@/*` by default)? No / Yes     => No

## => Usage Guidelines Structure
<!-- backend  -->
1- models = "user", "ConversationModel", "UserModel"
2- api    = auth                   => signup, login, logout, me
            chat                   => conversation, message
            socket                 => socket.io => server async fn(io.use, io.on) 
                                      note [creating room for conversation using model and getUserFromRequest]  
3- proxy  = middleware             => next/server proxy(path, token) note[a gatekeeper check the token before render page] 
4- .env   = config                 => your_secrets      
4- li     = helper
            mongo.js               => database;
            createRootAdmin        => Create by default root admin
            reponse.js             => json, success & error;
            scoket.js              => socket.io-client => io fn(initSocket, getSocket)
            validation.js          => zod validation schema;
            axios.js               => baseURL, withCredentials, headers;
            cookie.js              => serialize, parse, fn(setTokenCookie, clearTokenCookie);   
            getUserFromRequest.js  => getUserFromCookies note[store user info];       
            auth.js                => bcrypt fn[hashPassword, comparePassword], 
                                      jose     fn[signToken, verifyToken], 
                                      Cookies  fn[getAuthCookieHeader, clearAuthCookieHeader]
<!-- frontend -->
1- redux    = store.js, SliceTunk.js, Provider.jsx
2- pages    = auth-pages           => signup, login, me, logout
              user-pages           => admin-dashboard, cusomer-dashboard 
3-component = header(navbar,mobilemenu), footer, shadcn/ui
4-app       = layout.jsx => page.jsx

## => what kind of dependencies install 
<!-- backend  -->
["bcryptjs", "jose-jwt", "cookie", "axios", "mongoose", "socket.io", "socket.io-client", "zod"];

<!-- frontend -->
["hookform/resolvers", "reduxjs/toolkit", "react-hook-form", "lucide-react", "axios", "tailwind", " shadcn/ui", "zod", lucide-react];

## => Technologies Used
Next.js run on edge
Tailwind CSS
App-router
React-redux
mongodb for database
Scoket.io for instant-replay
JavaScript (ES6+)

## "use-client" and "use-server"
In Next.js (App Router), "use client" and "use server" tell Next.js where the code should run. By default, components run on the server. We use "use client" when a component needs browser features like React hooks (useState, useEffect), Redux, or event handlers such as onClick. We use "use server" for secure server-only logic like database access, authentication, and form actions. In simple terms, interactive UI runs on the client, while data-secure and backend logic runs on the server.

In Next.js, "use server" is usually used for backend logic. This includes things like database operations, authentication, reading cookies or headers, and handling secure form actions. Code marked with "use server" runs only on the server, so it keeps sensitive data and logic safe. In simple words, anything that belongs to the backend should run on the server using "use server".

In Next.js, server-side code runs on the backend by default, so we usually do not need to write "use server". We only write "use server" when it is required, such as when defining Server Actions that must be explicitly marked to run on the server. In simple words, backend logic already runs on the server by default, and "use server" is used only when we need to tell Next.js explicitly that a function should run on the server.

     "dev": "next dev",
     "build": "next build",
     "start": "next start",