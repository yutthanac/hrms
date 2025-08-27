// src/components/common/ProfilePopover.jsx
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ProfilePopoverHead.css';
import picpon from '../../../pic/pon.jpg';

export default function ProfilePopover({ user = {}, role = 'employee', onLogout }) {
  const [open, setOpen] = useState(false);
  const popRef    = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popRef.current   && !popRef.current.contains(e.target) &&
        toggleRef.current&& !toggleRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const infoList = role === 'head'
    ? [
        { label: 'ตำแหน่ง',    value: user.position        },
        { label: 'แผนก',      value: user.department || '-' },
        { label: 'ทีมงาน',    value: user.teamCount ?? '-' },
      ]
    : [
        { label: 'รหัสพนง.',  value: user.employeeId        },
        { label: 'ตำแหน่ง',    value: user.position        },
        { label: 'วันลาคงเหลือ', value: `${user.leaveLeft ?? '-'} วัน` },
      ];

  return (
    <div className="profile-pop-wrapper">
      <button
        ref={toggleRef}
        className={`profile-toggle ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className="profile-name">{user.name || 'Guest'}</span>
        <img src={user.profilePic || picpon} alt="avatar" />
      </button>
      {open && (
        <div ref={popRef} className="profile-pop-card" role="dialog">
          <h4>{role === 'head' ? 'ข้อมูลหัวหน้า' : 'ข้อมูลด่วน'}</h4>

          {infoList.map((row) => (
            <p key={row.label}>
              <strong>{row.label}:</strong> {row.value}
            </p>
          ))}

          {onLogout && (
            <button className="pop-logout-btn" onClick={onLogout}>
              ออกจากระบบ
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ───────── PropTypes ───────── */
ProfilePopover.propTypes = {
  user: PropTypes.shape({
    name:        PropTypes.string,
    profilePic:  PropTypes.string,
    employeeId:  PropTypes.string,  // employee only
    position:    PropTypes.string,
    leaveLeft:   PropTypes.number,  // employee only
    department:  PropTypes.string,  // head only
    teamCount:   PropTypes.number,  // head only
  }),
  role:     PropTypes.oneOf(['employee', 'head']),
  onLogout: PropTypes.func,
};
