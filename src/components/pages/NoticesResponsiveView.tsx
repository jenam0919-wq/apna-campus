import React, { useState, useMemo } from 'react';
import { NoticeMainHeader } from '../NoticeMainHeader';
import { NoticeCategoryTabs } from '../NoticeCategoryTabs';
import { FeaturedNoticeCard } from '../FeaturedNoticeCard';
import { EmergencyNoticeCard } from '../EmergencyNoticeCard';
import { NoticeCard } from '../NoticeCard';
import { NoticeDetailsModal } from '../NoticeDetailsModal';
import { TargetedAudienceCard } from '../TargetedAudienceCard';
import { ReadActionTrackingCard } from '../ReadActionTrackingCard';
import { NotificationPreferencesCard } from '../NotificationPreferencesCard';
import { EmptyState } from '../EmptyState';
import { Pagination } from '../Pagination';
import { BottomSummaryStats } from '../BottomSummaryStats';
import { NoticeItem, NoticeCategory, NoticePriority } from '../../types/notice';
import { ALL_NOTICES, FEATURED_NOTICE, EMERGENCY_NOTICE } from '../../data/mockNotices';

interface NoticesResponsiveViewProps {
  onTriggerToast: (msg: string) => void;
  selectedNoticeExternal?: NoticeItem | null;
  onClearSelectedNoticeExternal?: () => void;
}

export const NoticesResponsiveView: React.FC<NoticesResponsiveViewProps> = ({
  onTriggerToast,
  selectedNoticeExternal,
  onClearSelectedNoticeExternal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<NoticeCategory>('All');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<NoticePriority | 'All'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'priority' | 'action'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const [notices, setNotices] = useState<NoticeItem[]>(ALL_NOTICES);
  const [featuredNotice, setFeaturedNotice] = useState<NoticeItem>(FEATURED_NOTICE);
  const [emergencyNotice, setEmergencyNotice] = useState<NoticeItem>(EMERGENCY_NOTICE);
  const [internalSelectedNotice, setInternalSelectedNotice] = useState<NoticeItem | null>(null);

  const selectedNotice = selectedNoticeExternal || internalSelectedNotice;

  const handleCloseModal = () => {
    setInternalSelectedNotice(null);
    if (onClearSelectedNoticeExternal) onClearSelectedNoticeExternal();
  };

  const handleToggleRead = (id: string) => {
    if (id === featuredNotice.id) {
      const updated = { ...featuredNotice, isRead: !featuredNotice.isRead };
      setFeaturedNotice(updated);
      onTriggerToast(updated.isRead ? 'Marked featured notice as read' : 'Marked featured notice as unread');
      return;
    }
    if (id === emergencyNotice.id) {
      const updated = { ...emergencyNotice, isRead: !emergencyNotice.isRead };
      setEmergencyNotice(updated);
      return;
    }

    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const newStatus = !n.isRead;
          onTriggerToast(newStatus ? `Notice "${n.title.slice(0, 30)}..." marked as read` : `Notice marked as unread`);
          return { ...n, isRead: newStatus };
        }
        return n;
      })
    );
  };

  const handleMarkAllAsRead = () => {
    setFeaturedNotice((prev) => ({ ...prev, isRead: true }));
    setEmergencyNotice((prev) => ({ ...prev, isRead: true }));
    setNotices((prev) => prev.map((n) => ({ ...n, isRead: true })));
    onTriggerToast('All campus notices marked as read.');
  };

  const handleAcknowledgeEmergency = (id: string) => {
    setEmergencyNotice((prev) => ({
      ...prev,
      acknowledged: true,
      isRead: true,
      actionCompleted: true,
    }));
    onTriggerToast('✓ Emergency evacuation drill protocol acknowledged.');
  };

  const handleTakeAction = (notice: NoticeItem) => {
    if (notice.actionTitle?.includes('Hall Ticket')) {
      onTriggerToast('Mid-Semester Examination Hall Ticket downloaded (PDF).');
    } else if (notice.actionTitle?.includes('Rebate')) {
      onTriggerToast('Mess Rebate application window opened in student portal.');
    } else if (notice.actionTitle?.includes('Acknowledge')) {
      handleAcknowledgeEmergency(notice.id);
      return;
    } else {
      onTriggerToast(`Action "${notice.actionTitle || 'Verified'}" completed.`);
    }

    if (notice.id === featuredNotice.id) {
      setFeaturedNotice((prev) => ({ ...prev, actionCompleted: true, isRead: true }));
    } else {
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, actionCompleted: true, isRead: true } : n))
      );
    }
  };

  const unreadCount = useMemo(() => {
    let count = notices.filter((n) => !n.isRead).length;
    if (!featuredNotice.isRead) count += 1;
    if (!emergencyNotice.isRead) count += 1;
    return count;
  }, [notices, featuredNotice, emergencyNotice]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: notices.length,
      Academic: 0,
      Examination: 0,
      Hostel: 0,
      Events: 0,
      Fees: 0,
      Emergency: 0,
    };
    notices.forEach((n) => {
      if (counts[n.category] !== undefined) {
        counts[n.category]++;
      }
    });
    return counts;
  }, [notices]);

  const filteredNotices = useMemo(() => {
    return notices
      .filter((n) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = n.title.toLowerCase().includes(q);
          const matchSummary = n.summary.toLowerCase().includes(q);
          const matchDept = n.issuingDepartment.toLowerCase().includes(q);
          const matchAudience = n.targetAudience.toLowerCase().includes(q);
          if (!matchTitle && !matchSummary && !matchDept && !matchAudience) return false;
        }

        if (!showUnreadOnly && activeCategory !== 'All' && n.category !== activeCategory) {
          return false;
        }

        if (showUnreadOnly && n.isRead) {
          return false;
        }

        if (priorityFilter !== 'All' && n.priority !== priorityFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const priorityScore: Record<NoticePriority, number> = {
            Emergency: 4,
            Urgent: 3,
            Important: 2,
            Normal: 1,
          };
          return priorityScore[b.priority] - priorityScore[a.priority];
        }
        if (sortBy === 'action') {
          return (b.actionRequired ? 1 : 0) - (a.actionRequired ? 1 : 0);
        }
        return 0;
      });
  }, [notices, searchQuery, activeCategory, showUnreadOnly, priorityFilter, sortBy]);

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage) || 1;
  const paginatedNotices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNotices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotices, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 3. MAIN HEADER */}
      <NoticeMainHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        onMarkAllAsRead={handleMarkAllAsRead}
        unreadCount={unreadCount}
      />

      {/* 4. NOTICE CATEGORIES TABS */}
      <NoticeCategoryTabs
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setCurrentPage(1);
        }}
        showUnreadOnly={showUnreadOnly}
        onToggleUnreadOnly={() => {
          setShowUnreadOnly(!showUnreadOnly);
          setCurrentPage(1);
        }}
        unreadCount={unreadCount}
        categoryCounts={categoryCounts}
      />

      {/* EMERGENCY ALERT CARD */}
      {(activeCategory === 'All' || activeCategory === 'Emergency') && !showUnreadOnly && (
        <EmergencyNoticeCard
          notice={emergencyNotice}
          onViewDetails={(n) => setInternalSelectedNotice(n)}
          onAcknowledge={handleAcknowledgeEmergency}
        />
      )}

      {/* FEATURED NOTICE CARD */}
      {(activeCategory === 'All' || activeCategory === 'Examination') && !showUnreadOnly && (
        <FeaturedNoticeCard
          notice={featuredNotice}
          onViewDetails={(n) => setInternalSelectedNotice(n)}
          onToggleRead={handleToggleRead}
        />
      )}

      {/* TWO-COLUMN ON DESKTOP, STACKED ON MOBILE (Section 12) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Left Column: Notice Cards List & Pagination */}
        <div className="space-y-4 min-w-0">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              {showUnreadOnly
                ? 'Unread Announcements'
                : activeCategory === 'All'
                ? 'Recent Campus Notices'
                : `${activeCategory} Notices`}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {filteredNotices.length} {filteredNotices.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {paginatedNotices.length === 0 ? (
            <EmptyState
              onClearFilters={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setShowUnreadOnly(false);
                setPriorityFilter('All');
                setCurrentPage(1);
              }}
            />
          ) : (
            <div className="space-y-3.5">
              {paginatedNotices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onViewDetails={(n) => setInternalSelectedNotice(n)}
                  onToggleRead={handleToggleRead}
                  onTakeAction={handleTakeAction}
                />
              ))}
            </div>
          )}

          {filteredNotices.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredNotices.length}
            />
          )}

          <BottomSummaryStats
            totalNotices={24}
            unreadCount={unreadCount}
            actionRequiredCount={3}
            importantCount={2}
          />
        </div>

        {/* Right Column: Targeted Notice + Engagement + Notification Preferences */}
        <div className="space-y-6">
          <TargetedAudienceCard />
          <ReadActionTrackingCard
            delivered={186}
            read={164}
            unread={22}
            actionCompleted={132}
          />
          <NotificationPreferencesCard
            onSettingsChange={() => onTriggerToast('Notification preferences updated')}
          />
        </div>
      </div>

      {/* Notice Details Modal */}
      <NoticeDetailsModal
        notice={selectedNotice}
        onClose={handleCloseModal}
        onToggleRead={handleToggleRead}
        onTakeAction={handleTakeAction}
      />
    </div>
  );
};
