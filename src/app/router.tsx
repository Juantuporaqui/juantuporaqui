// ============================================
// CASE OPS - Router Configuration
// ============================================

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './AppShell';

// Features
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { SearchPage } from '../features/search/SearchPage';
import { DocumentsPage } from '../features/documents/DocumentsPage';
import { DocumentDetailPage } from '../features/documents/DocumentDetailPage';
import { DocumentFormPage } from '../features/documents/DocumentFormPage';
import { PdfViewerPage } from '../features/pdfviewer/PdfViewerPage';
import { FactsPage } from '../features/facts/FactsPage';
import { FactDetailPage } from '../features/facts/FactDetailPage';
import { FactFormPage } from '../features/facts/FactFormPage';
import { PartidasPage } from '../features/partidas/PartidasPage';
import { PartidaDetailPage } from '../features/partidas/PartidaDetailPage';
import { PartidaFormPage } from '../features/partidas/PartidaFormPage';
import { EventsPage } from '../features/events/EventsPage';
import { EventFormPage } from '../features/events/EventFormPage';
import { WarRoomPage } from '../features/warroom/WarRoomPage';
import { StrategyFormPage } from '../features/warroom/StrategyFormPage';
import { TasksPage } from '../features/tasks/TasksPage';
import { BackupPage } from '../features/backup/BackupPage';
import { MorePage } from '../features/dashboard/MorePage';
import { SettingsPage } from '../features/dashboard/SettingsPage';
import { CasesPage } from '../features/cases/CasesPage';
import { CaseDetailPage } from '../features/cases/CaseDetailPage';
import { AnalyticsDashboardPage } from '../features/analytics/pages/AnalyticsDashboard';
import { AnalyticsAdminPage } from '../features/analytics/pages/AnalyticsAdminPage';
import { CourtDashboard } from '../features/analytics/pages/CourtDashboard';
import { HechosPage } from '../features/analytics/pages/HechosPage';
import { PrescripcionPage } from '../features/analytics/pages/PrescripcionPage';
import { ModoAudienciaPage } from '../features/audiencia/ModoAudienciaPage';
import { AudienciaPreviaPage } from '../features/audiencia/AudienciaPreviaPage';
import { ToolsPage } from '../features/tools/ToolsPage';
import { Sts458Page } from '../features/jurisprudencia/Sts458Page';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        {
          index: true,
          element: <Navigate to="/cases" replace />,
        },
        {
          path: 'dashboard',
          element: <DashboardPage />,
        },
        {
          path: 'analytics',
          element: <AnalyticsDashboardPage />,
        },
        {
          path: 'analytics/admin',
          element: <AnalyticsAdminPage />,
        },
        {
          path: 'analytics/prescripcion',
          element: <PrescripcionPage />,
        },
        {
          path: 'analytics/hechos',
          element: <HechosPage />,
        },
        {
          path: 'analytics/audiencia',
          element: <ModoAudienciaPage />,
        },
        {
          path: 'audiencia-previa',
          element: <AudienciaPreviaPage />,
        },
        {
          path: 'tools',
          element: <ToolsPage />,
        },
        {
          path: 'juris/sts458',
          element: <Sts458Page />,
        },
        {
          path: 'analytics/:court',
          element: <CourtDashboard />,
        },
        {
          path: 'search',
          element: <SearchPage />,
        },
        // Cases
        {
          path: 'cases',
          element: <CasesPage />,
        },
        {
          path: 'cases/:id',
          element: <CaseDetailPage />,
        },
        // Documents
        {
          path: 'documents',
          element: <DocumentsPage />,
        },
        {
          path: 'documents/new',
          element: <DocumentFormPage />,
        },
        {
          path: 'documents/:id',
          element: <DocumentDetailPage />,
        },
        {
          path: 'documents/:id/edit',
          element: <DocumentFormPage />,
        },
        {
          path: 'documents/:id/view',
          element: <PdfViewerPage />,
        },
        // Facts
        {
          path: 'facts',
          element: <FactsPage />,
        },
        {
          path: 'facts/new',
          element: <FactFormPage />,
        },
        {
          path: 'facts/:id',
          element: <FactDetailPage />,
        },
        {
          path: 'facts/:id/edit',
          element: <FactFormPage />,
        },
        // Partidas
        {
          path: 'partidas',
          element: <PartidasPage />,
        },
        {
          path: 'partidas/new',
          element: <PartidaFormPage />,
        },
        {
          path: 'partidas/:id',
          element: <PartidaDetailPage />,
        },
        {
          path: 'partidas/:id/edit',
          element: <PartidaFormPage />,
        },
        // Events/Timeline
        {
          path: 'events',
          element: <EventsPage />,
        },
        {
          path: 'events/new',
          element: <EventFormPage />,
        },
        {
          path: 'events/:id/edit',
          element: <EventFormPage />,
        },
        // War Room
        {
          path: 'warroom',
          element: <WarRoomPage />,
        },
        {
          path: 'warroom/new',
          element: <StrategyFormPage />,
        },
        {
          path: 'warroom/:id/edit',
          element: <StrategyFormPage />,
        },
        // Tasks
        {
          path: 'tasks',
          element: <TasksPage />,
        },
        // Backup
        {
          path: 'backup',
          element: <BackupPage />,
        },
        // More & Settings
        {
          path: 'more',
          element: <MorePage />,
        },
        {
          path: 'settings',
          element: <SettingsPage />,
        },
      ],
    },
  ],
  {
    // Respeta el "base" de Vite (p.ej. /DEMANDAS/ en GitHub Pages)
    basename: import.meta.env.BASE_URL,
  }
);
