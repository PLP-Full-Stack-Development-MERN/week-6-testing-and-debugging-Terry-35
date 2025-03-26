import { useEffect, useState } from 'react'

function BugList() {
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchBugs();
    }
    , []);
    const fetchBugs = async () => {
        setLoading(true);
        console.log(import.meta.env.VITE_API_URL, "fetching backend");
        try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bugs/`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },

            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 404) {
                    setError("No bugs found");
                }
                else if (res.status === 500) {
                    setError("An error occured on the server. Try reloading the page");
                }
    
                return;
            }
            setBugs(data);
            console.log(data);
        } catch(err){
            console.log(err);
            setError("An error occured on the server. Try reloading the page");
        } finally {
            setLoading(false);
        }
    }
    const deleteBug = async (id) => {
        console.log(id, "deleting bug");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bugs/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) {
                console.log("error", res.status);
                return;
            }
            setBugs(bugs.filter((bug) => bug.id !== id));
        } catch (err) {
            console.log(err);
        }finally{
            fetchBugs();
        }
    }

  return (
    <div>
        <h2 className="text-xl font-bold my-4">Bug List</h2>
        {
            loading ? 
            (<p className='text-lg text-gray-500'>Loading...</p>) 
            : 
            ( 
            <div className="flex flex-col gap-2">
                {bugs.length === 0 && <p className="text-lg text-gray-500">No bugs found</p>}
                {bugs.map((bug) => (
                <div key={bug.id} className="bg-gray-200 shadow-md p-4 rounded-md">
                    <h3 className="font-bold">{bug.title}</h3>
                    <p>{bug.description}</p>
                    <p>{bug.priority}</p>
                    <div>
                        <button
                        onClick={() => deleteBug(bug._id) }
                         className="bg-red-500 text-white px-2 py-1 rounded-md">Delete</button>
                    </div>
                </div>
                ))}
            </div>)
        }
       
    </div>
  )
}

export default BugList