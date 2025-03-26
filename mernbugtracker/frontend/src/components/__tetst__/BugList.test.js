import { render, screen, waitFor } from "@testing-library/react";
import BugList from "../BugList";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";

// Mock API responses
const server = setupServer(
  rest.get(`${import.meta.env.VITE_API_URL}/api/bugs/`, (req, res, ctx) => {
    return res(ctx.json([
      { _id: "1", title: "Bug 1", description: "First bug", priority: "High" },
      { _id: "2", title: "Bug 2", description: "Second bug", priority: "Low" },
    ]));
  }),
  rest.delete(`${import.meta.env.VITE_API_URL}/api/bugs/:id`, (req, res, ctx) => {
    return res(ctx.status(200));
  })
);

// Start and stop mock server before and after tests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("BugList Component", () => {
  test("renders loading state initially", () => {
    render(<BugList />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test("fetches and displays bugs", async () => {
    render(<BugList />);

    // Wait for bugs to be displayed
    await waitFor(() => expect(screen.getByText("Bug 1")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Bug 2")).toBeInTheDocument());

    expect(screen.getByText("First bug")).toBeInTheDocument();
    expect(screen.getByText("Second bug")).toBeInTheDocument();
  });

  test("handles API error correctly", async () => {
    // Mock an error response
    server.use(
      rest.get(`${import.meta.env.VITE_API_URL}/api/bugs/`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<BugList />);
    await waitFor(() =>
      expect(
        screen.getByText("An error occured on the server. Try reloading the page")
      ).toBeInTheDocument()
    );
  });

  test("deletes a bug when delete button is clicked", async () => {
    render(<BugList />);
    await waitFor(() => screen.getByText("Bug 1"));

    // Click delete button
    const deleteButton = screen.getAllByText("Delete")[0];
    userEvent.click(deleteButton);

    // Wait for the bug to be removed
    await waitFor(() => expect(screen.queryByText("Bug 1")).not.toBeInTheDocument());
  });

  test("shows 'No bugs found' if list is empty", async () => {
    server.use(
      rest.get(`${import.meta.env.VITE_API_URL}/api/bugs/`, (req, res, ctx) => {
        return res(ctx.json([]));
      })
    );

    render(<BugList />);
    await waitFor(() => screen.getByText("No bugs found"));
  });
});
