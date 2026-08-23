import { Greeting } from './Greeting';
import { ChatBot } from './ChatBot';
// Remove stale import
// import { OldFeature } from './OldFeature';

export async function fetchData() {
  // Existing implementation
  const response = await fetch('/api/data');
  return await response.json();
}

export function formatData(data) {
  // Existing implementation
  return data.map(item => ({
    ...item,
    formatted: `Processed ${item.name}`
  }));
}

// ⚠️ Fixing REACT_025: Single main element in Dashboard
export function Dashboard() {
  const [chatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    // Await ChatBot interaction using IVY
    const response = useInteraction(ChatBot);
    chatHistory.push({ text: userInput, response: response });
    setUserInput('');
    setIsLoading(false);
  };

  return (
    <div className="layout" aria-live="polite">
      {/* Header component should contain logo/branding */}
      <Header />
      
      {/* Single main element containing region-specific content */}
      <main>
        {/* Help section using section/article */}
        <section aria-label="Help section" className="help">
          <h2>Dashboard Help</h2>
          <p>Available commands: greet, ask, help</p>
        </section>

        {/* Chat interface wrapped in article */}
        <article className="chat-window">
          <ChatBot data={waitData} />
        </article>

        {/* Error/success states using different tag */}
        <p className="status text-red">
          Error: {{errorMessage}} (mutually exclusive with success state)
        </p>
        
        {/* Alert box accessibility feature */}
        <div 
          aria-live="atomic" 
          aria-atomic="true"
          className={`alert ${isLoading ? 'loading' : ''}`}
        >
          {{Alert}}
        </div>
      </main>
    </div>
  );
}

// New component for layout structure
export function Layout() {
  return (
    <LayoutContainer>
      <Header />
      <main />
    </LayoutContainer>
  );
}

// Keep all other existing components and functions
// ... (existing code continues)