import { useState } from "react";

export default function BugTracker() {
  const [bug, setBug] = useState({
    title: "",
    description: "",
    priority: "open",

  });

  const addBug = async () => {
    console.log(bug);
    if (!bug.title || !bug.description) {
        alert("Please enter a title and description");
      return;
      
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bugs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bug),
      });
      if (!res.ok) {
        console.log("error", res.status);
        return;
      }
      setBug({
        title: "",
        description: "",
        priority: "open",
      });
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="p-6  mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Bug Tracker</h2>

      <div className="flex md:flex-row flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter bug title"
          className="border p-2 flex-grow rounded"
            value={bug.title}
            onChange={(e) => setBug({ ...bug, title: e.target.value })}
          
        />
         <input
          type="text"
          placeholder="Enter bug description"
          className="border p-2 flex-grow rounded"
            value={bug.description}
            onChange={(e) => setBug({ ...bug, description: e.target.value })}
          
        />

        <select
          className="border p-2 rounded"
          value={bug.priority}
            onChange={(e) => setBug({ ...bug, priority: e.target.value })}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        
      </div>
      <button
          className="bg-blue-500 w-[50%] hover:cursor-pointer text-white px-4 py-2 rounded"
          onClick={addBug}
        >
          Add Bug
        </button>
    </div>
  );
}
