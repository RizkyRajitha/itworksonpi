---
title: "Execute Terminal Commands and Receive Live Output with React+SSE"
date: "2023-07-04"
categories: "WebDev,React"
featured: "true"
overview: "Discover how to build React frontend to receive terminal command execution output using SSE and integrate it with SSE API to view realtime command execution output."
---

## Hello everyone,

This is the second part of Node.js + SSE if you haven't checked out [part one](https://codehirise.com/post/building-a-real-time-command-execution-app-with-node-js-sse) where we create SSE server I highly recommend you to check it out first.

![Final output](/assets/sse2/out_91d7ad19b3.gif)

## Client

Here i will go with react + vite setup with tailwind as UI, but you can use any framework/library you want since these basics will stay the same.

I assume that you have installed [nodejs](https://nodejs.org/en) and have a code editor setup, and you have previously created SSE server running on `localhost:3000`

```bash
mkdir ssedemoclient
```

```bash
yarn create vite
```

i will also install tailwind ui setup. check out [tailwind official doc for setting up](https://tailwindcss.com/docs/guides/vite) for setting up with react+vite.
<br>
</br>

Add the below code snippet to `app.js`.

```js
import { useState } from "react";
import "./App.css";

let events = null;

function App() {
  const [commandOut, setCommandOut] = useState([]);
  const [isActive, setisActive] = useState(false);

  const sendCommand = (command) => {
    // close current event if user submit another command
    if (events) {
      console.log("close current event");
      setCommandOut([]);
      events.close();
    }

    if (!command) {
      console.log("Empty command");
      return;
    }

    // create event source
    events = new EventSource(`http://localhost:3000/run?command=${command}`);

    // add eventlistner for message output from command
    events.addEventListener(
      "stdout",
      function (e) {
        let parsedData = JSON.parse(e.data);
        console.log(parsedData);
        setCommandOut((pre) => [parsedData, ...pre]);
      },
      false
    );

    events.addEventListener(
      "stderr",
      function (e) {
        let parsedData = JSON.parse(e.data);
        console.log(parsedData);
        setCommandOut((pre) => [parsedData, ...pre]);
      },
      false
    );

    events.addEventListener(
      "err",
      function (e) {
        let parsedData = JSON.parse(e.data);
        console.log(parsedData);
        setCommandOut((pre) => [parsedData, ...pre]);
      },
      false
    );

    events.addEventListener(
      "open",
      function (e) {
        console.log("open");
        setisActive(true);
      },
      false
    );
    // event handler for command exit to stop retry
    events.addEventListener(
      "exit",
      function (e) {
        console.log("exited");
        events.close();
        setisActive(false);
      },
      false
    );

    events.addEventListener(
      "error",
      function (e) {
        if (e.readyState == EventSource.CLOSED) {
          // Connection was closed.
          setisActive(false);
        }
      },
      false
    );

    events.addEventListener("error", (e) => {
      console.log("An error occurred while attempting to connect.");
      setisActive(false);
      events.close();
    });
  };

  return (
    <div className="bg-slate-800 h-screen">
      <div className="container mx-auto ">
        <div className="h-[20vh]">
          <h1 className="text-3xl text-cyan-50 pt-10 font-bold text-center">
            Run command with SSE Demo
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(e.target[0].value);
              sendCommand(e.target[0].value);
            }}
          >
            <div className="flex flex-row justify-between align-middle self-center content-center pt-10 w-full">
              <input
                type="text"
                id="last_name"
                className="bg-gray-50 border border-gray-300 placeholder-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[90%] p-2.5"
                placeholder="Enter command to run"
                required
              />
              {/* show only when listening to messeges */}
              <div
                className={`content-center flex flex-wrap ${
                  isActive ? "" : "hidden"
                }`}
              >
                {/* spinner animation on active conenction */}
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-6 h-6 mx-3 text-blue-600 animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#a6c0d7"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              {/* show connection close button */}
              {isActive && (
                <button
                  type="button"
                  className="text-white bg-slate-500 hover:bg-slate-600 p-2 font-medium rounded-lg text-sm px-5 mr-4"
                  onClick={() => {
                    console.log("event listen stopped");
                    events.close();
                    setisActive(false);
                  }}
                >
                  Stop
                </button>
              )}
              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-800 p-2 font-medium rounded-lg text-sm px-5 "
              >
                Run
              </button>
            </div>
          </form>
        </div>
        {/* list down commands with timestamp */}
        <div className="text-white pt-10 whitespace-pre h-[80vh] overflow-y-auto">
          {commandOut.map((data, index) => (
            <div className="flex" key={index}>
              <div>
                <p className="mr-2 text-sky-400">{`${new Date()
                  .toLocaleString()
                  .replace("T", " ")} : `}</p>
                <p>{data.type}</p>
              </div>
              <p>{data.out}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
```

`EventSource` is where the server SSE integrates with the Client end.

`EventSource` is a javascript API that enables the client side to receive SSE from a server over a single, long-lived HTTP connection.
<br>
</br>

Then we need to add event listers to `EventSource`. here we need to listen to the events we send from the server end which are `stdout`,`stderr`, `err`, and `exit` events.
<br>
</br>
We maintain one `useState` for managing command outputs and one for keeping the command execution state since we can execute commands like `tail` to get realtime updates of a file that follow file changes realtime.
<br>
</br>
`exit` EventListener will close the connection from the client end so it is not automatically retried.

after we update the state to `commandOut`, we need to render ui with event type, time, and command output using the array map method.

<br>
</br>
I have added additional functionality cancel where we can close the current connection to stop listening to events. in this case, the client will close the connection and the command executing on the server will also be killed.

<br>
</br>

If everything goes well, you will get below UI.

[Git repo](https://github.com/RizkyRajitha/node-react-sse-code-executor/tree/master/client/sse-run-command)

![final ui](/assets/sse2/appui_c5803993f7.png)

### Thank you for reading. Share if you loved it.
