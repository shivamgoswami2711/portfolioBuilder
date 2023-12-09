import React, { useState } from "react";

function Ex() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
    </div>
  );
}

export default Ex;
