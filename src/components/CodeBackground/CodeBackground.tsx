"use client";
import { useEffect, useState } from 'react';
import './CodeBackground.css';

const CODE_SNIPPETS = [
  "const [state, setState] = useState(null);",
  "import { useEffect } from 'react';",
  "module.exports = { extend: { colors: { slate: '#0A1121' } } };",
  "async function fetchData() { return await api.get('/data'); }",
  "if (process.env.NODE_ENV === 'production') {}",
  "export default function App({ children }) { return <>{children}</>; }",
  "mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });",
  "app.use(express.json());",
  "const router = express.Router();",
  "app.listen(PORT, () => console.log(`Server running on port ${PORT}`));",
  "db.collection('projects').doc(id).set(data);",
  "useEffect(() => { window.addEventListener('scroll', handleScroll); }, []);"
];

export default function CodeBackground() {
  const [snippets, setSnippets] = useState<{ id: number; text: string; left: number; top: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate random code snippets floating in the background
    const newSnippets = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
      left: Math.random() * 90, // 0 to 90vw
      top: Math.random() * 100, // 0 to 100vh
      delay: Math.random() * -20, // Start at different times
      duration: 30 + Math.random() * 40, // 30s to 70s to drift up
    }));
    setSnippets(newSnippets);
  }, []);

  return (
    <div className="code-background">
      <div className="code-background__overlay"></div>
      {snippets.map((snippet) => (
        <div
          key={snippet.id}
          className="code-snippet"
          style={{
            left: `${snippet.left}vw`,
            top: `${snippet.top}vh`,
            animationDelay: `${snippet.delay}s`,
            animationDuration: `${snippet.duration}s`
          }}
        >
          {snippet.text}
        </div>
      ))}
    </div>
  );
}
