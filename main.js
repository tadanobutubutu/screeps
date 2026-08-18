import './globals.css'
import { Inter } from 'next/font/google'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { RootState } from '@/app/store'
import { fetchDashboardData } from '@/app/dashboardSlice'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import DashboardStats from '@/components/DashboardStats'
import DashboardCharts from '@/components/DashboardCharts'
import DashboardActions from '@/components/DashboardActions'

const inter = Inter({ subsets: ['latin'] })

interface DashboardProps {
  // Add any props if needed
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const dispatch = useDispatch()
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard)
  const [activeTab, setActiveTab] = useState<string>('overview')

  useEffect(() => {
    dispatch(fetchDashboardData())
  }, [dispatch])

  if (loading) {
    return (
      <div className="dashboard-container">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <ErrorDisplay message={error} />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="dashboard-container">
        <div>No data available</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="dashboard-tabs">
            <button
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={activeTab === 'analytics' ? 'active' : ''}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
            <button
              className={activeTab === 'actions' ? 'active' : ''}
              onClick={() => setActiveTab('actions')}
            >
              Actions
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <section className="dashboard-section">
              <DashboardStats data={data.stats} />
            </section>
          )}
          {activeTab === 'analytics' && (
            <section className="dashboard-section">
              <DashboardCharts data={data.charts} />
            </section>
          )}
          {activeTab === 'actions' && (
            <section className="dashboard-section">
              <DashboardActions data={data.actions} />
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}