import React, { useState, useEffect } from "react";
import MyWebStorageAPI from "./webStorageAPI";
import "./App.css";

const ALL = 0,
  ACTIVE = 1,
  COMPLETED = 2;

const myWebStorage = new MyWebStorageAPI();

const demoEntries = [
  { text: "Buy chocolate", isActive: true, id: 0 },
  { text: "Quit slacking", isActive: false, id: 1 },
  { text: "Write toDo app", isActive: false, id: 2 },
  { text: "Do 15 laps around the block", isActive: true, id: 3 },
  { text: "Cook delicious meal", isActive: true, id: 4 },
];

const App = () => {
  const [showListType, changeShowListType] = useState(ALL);
  const [list, changeList] = useState(demoEntries);
  const [entry, changeEntry] = useState("");

  // Load todo list from local storage (WebStorage API)
  useEffect(() => {
    const storedList = myWebStorage.getList();
    if (!storedList.length) return;

    changeList(storedList);
  }, []);

  const addEntry = (e) => {
    e.preventDefault();
    if (!entry.length) return;

    const newList = [
      ...list,
      { text: entry.slice(0, 40), isActive: true, id: entry + Math.random() },
    ];

    changeList(newList);
    changeEntry("");
    myWebStorage.saveList(newList);

    if (showListType === COMPLETED) changeShowListType(ACTIVE);
  };

  const toggleActive = (id) => {
    const newList = [...list];
    newList.forEach((item) => {
      if (item.id === id) item.isActive = !item.isActive;
    });

    changeList(newList);
    myWebStorage.saveList(newList);
  };

  const removeItem = (id) => {
    const newList = list.filter((item) => item.id !== id);
    changeList(newList);
    myWebStorage.saveList(newList);
  };

  return (
    <div className="App">
      <header>
        <h2>#toDo</h2>
      </header>

      <Navigation
        showListType={showListType}
        changeShowListType={changeShowListType}
      />

      <form onSubmit={addEntry}>
        <input onChange={(e) => changeEntry(e.target.value)} value={entry} />
        <button type="submit">+</button>
      </form>

      <AllList
        list={list}
        toggleActive={toggleActive}
        showListType={showListType}
      />

      <ActiveList
        list={list}
        toggleActive={toggleActive}
        showListType={showListType}
      />

      <CompletedList
        list={list}
        toggleActive={toggleActive}
        removeItem={removeItem}
        showListType={showListType}
      />

      <a className="blogLink" href="https://www.nikolas-blog.com">
        nikolas-blog.com
      </a>
    </div>
  );
};

export default App;

const AllList = ({ list, toggleActive, showListType }) => {
  if (showListType !== ALL) return null;

  return (
    <div className="list">
      {list.map((item) => (
        <div
          className={item.isActive ? "item" : "item itemCompleted"}
          onClick={() => toggleActive(item.id)}
          key={item.id}
        >
          <label
            style={item.isActive ? {} : { textDecoration: "line-through" }}
          >
            {item.text}
          </label>
        </div>
      ))}
    </div>
  );
};

const ActiveList = ({ list, toggleActive, showListType }) => {
  if (showListType !== ACTIVE) return null;

  return (
    <div className="list">
      {list
        .filter((item) => item.isActive)
        .map((item) => (
          <div
            className="item"
            onClick={() => toggleActive(item.id)}
            key={item.id}
          >
            <label>{item.text}</label>
          </div>
        ))}
    </div>
  );
};

const CompletedList = ({ list, toggleActive, showListType, removeItem }) => {
  if (showListType !== COMPLETED) return null;

  return (
    <div className="completedList">
      {list
        .filter((item) => !item.isActive)
        .map((item) => (
          <div className="itemWrapper" key={item.id}>
            <div className="item" onClick={() => toggleActive(item.id)}>
              <label>{item.text}</label>
            </div>
            <div className="deleteButton" onClick={() => removeItem(item.id)}>
              Delete
            </div>
          </div>
        ))}
    </div>
  );
};

const Navigation = ({ showListType, changeShowListType }) => (
  <nav>
    <ul>
      <NavElement
        text={"All"}
        showListType={showListType}
        changeShowListType={changeShowListType}
        index={ALL}
        underlineColor={"rgb(255, 81, 203)"}
      />

      <NavElement
        text={"Active"}
        showListType={showListType}
        changeShowListType={changeShowListType}
        index={ACTIVE}
        underlineColor={"rgb(97, 97, 255)"}
      />

      <NavElement
        text={"Completed"}
        showListType={showListType}
        changeShowListType={changeShowListType}
        index={COMPLETED}
        underlineColor={"rgb(226, 226, 226)"}
      />
    </ul>
  </nav>
);

const NavElement = ({
  text,
  showListType,
  changeShowListType,
  index,
  underlineColor,
}) => (
  <li
    onClick={() => changeShowListType(index)}
    style={
      showListType !== index
        ? {}
        : { borderBottom: `5px solid ${underlineColor}`, marginBottom: "-5px" }
    }
  >
    {text}
  </li>
);
