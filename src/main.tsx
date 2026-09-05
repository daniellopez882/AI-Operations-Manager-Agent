import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { DataSourceProvider } from './lib/DataSourceContext';
import { createSimulatedDataSource } from './lib/simulation';

// The only data source that exists is the in-browser simulation.
const source = createSimulatedDataSource();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <DataSourceProvider source={source}>
            <App />
        </DataSourceProvider>
    </React.StrictMode>,
);
