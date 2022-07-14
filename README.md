# Lemontime

Lemontime is a study/work timer designed for use with the pomodoro method. A built-in task list responds to the completion of time blocks, allowing users to track progress toward daily goals. User account creation provides access to additional features including the loading and saving of task list templates.

## Authentication and Authorization

For user authentication I decided to use the Bcrypt library to hash user passwords and Emailjs to send out a verification email. Once the user's email has been confirmed and they have logged in successfully, an authorization token is generated using jwt and returned to the client via the response header.

## Web Worker

In order for a pomodoro timer which lives in the browser to be of any real use, it must be able to run reliably in the background, when the tab is not selected. Most modern broswers implement some kind of throttling of background tabs to reduce CPU usage and extend battery life. This essentially pauses the timer whenever the user selects a different tab is selected

I decided to use a Web Worker to overcome this limitation, effectively giving the timer its own thread. This not only allows the timer to run in the background while other work is being done, but the timer also runs more consistently now that setInterval() isn't tying up the event loop in the main thread.

## Local Storage

Using local storage allowed me to keep unregistered user's timer settings and task lists consistent between visits. Although the most interesting/useful features are only available to users once they have created an account, I still wanted the app to be useful regardless.

## Managing State

Creating a settings page for users to customize timer functionality, resulted in many components needing to access and update various pieces of state. My initial approach was to raise the state up to the level of the App component. This made for an extremely bloated App component.

My first thought was to solve the issue using Redux, but after seeking advice from other developers, I decided that implementing Redux in a project of this size would be overkill. Instead, I decided to write a custom hook to manage any state which needed to be passed to multiple components, particularly any components with no common parent aside from the App component.

Once written, I could simply import the hook to the App component, assign it to a const and pass it to the necessary components. Once inside the component I use object destructuring to gain access to the different state variables and setters.