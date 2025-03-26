import BugList from "./components/BugList";
import BugTracker from "./components/BugTracker";


function App() {

  return (
    <div className="min-h-screen md:py-20 py-10 md:px-10 px-4 flex flex-col bg-gray-100">
      <BugTracker />
      <BugList />
    </div>
  )
}

export default App
