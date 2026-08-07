import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  TrendingUp,
  AlertTriangle,
  History,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Flood Map', path: '/flood-map', icon: Map },
  { name: 'Predictions', path: '/predictions', icon: TrendingUp },
  { name: 'Alerts', path: '/alerts', icon: AlertTriangle },
  { name: 'Historical Analysis', path: '/historical', icon: History },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🌊</div>
        <div>
          <h2>FloodAI</h2>
          <p className="logo-subtitle">Early Warning System</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;