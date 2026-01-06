from database import get_db
from repositories.checkin_repository import CheckInRepository
from repositories.goal_repository import GoalRepository
from datetime import date, timedelta
from typing import List, Tuple, Optional

class ProgressService:
    @staticmethod
    def get_current_period_dates(frequency: str) -> Tuple[date, date]:
        """Get start and end dates for the current period based on frequency"""
        today = date.today()
        
        if frequency == 'daily':
            return today, today
        elif frequency == 'weekly':
            start = today - timedelta(days=today.weekday())
            end = start + timedelta(days=6)
            return start, end
        elif frequency == 'monthly':
            start = today.replace(day=1)
            if today.month == 12:
                end = today.replace(day=31)
            else:
                end = (today.replace(month=today.month + 1, day=1) - timedelta(days=1))
            return start, end
        elif frequency == 'yearly':
            start = today.replace(month=1, day=1)
            end = today.replace(month=12, day=31)
            return start, end
        else:  # custom
            return date(2020, 1, 1), date(2099, 12, 31)
    
    @staticmethod
    def get_period_label(frequency: str) -> str:
        """Get human-readable label for the period"""
        labels = {
            'daily': 'today',
            'weekly': 'this week',
            'monthly': 'this month',
            'yearly': 'this year',
            'custom': 'all time'
        }
        return labels.get(frequency, '')
    
    @staticmethod
    def get_progress_by_frequency(user_id: int, frequency: str = None) -> dict:
        """Get progress for goals grouped by frequency for a specific user"""
        frequencies = [frequency] if frequency else ['daily', 'weekly', 'monthly', 'yearly', 'custom']
        result = {}
        
        for freq in frequencies:
            goals = GoalRepository.get_by_frequency(freq, user_id)
            if not goals:
                continue
            
            start_date, end_date = ProgressService.get_current_period_dates(freq)
            period_label = ProgressService.get_period_label(freq)
            
            goal_progress = []
            for goal in goals:
                # Calculate progress dynamically within time window
                progress = CheckInRepository.get_progress_in_window(
                    goal['id'],
                    start_date.isoformat(),
                    end_date.isoformat(),
                    user_id
                )
                
                target = goal['target_value']
                percentage = (progress / target * 100) if target > 0 else 0
                
                goal_progress.append({
                    'goal_id': goal['id'],
                    'title': goal['title'],
                    'category_id': goal['category_id'],
                    'current_value': progress,
                    'target_value': target,
                    'percentage': min(percentage, 100),
                    'period_label': period_label
                })
            
            result[freq] = goal_progress
        
        return result
    
    @staticmethod
    def get_goal_progress(goal_id: int, user_id: int) -> Optional[dict]:
        """Get current progress for a specific goal owned by user"""
        goal = GoalRepository.get_by_id(goal_id, user_id)
        if not goal:
            return None
        
        frequency = goal['frequency']
        start_date, end_date = ProgressService.get_current_period_dates(frequency)
        
        # Calculate progress dynamically
        progress = CheckInRepository.get_progress_in_window(
            goal_id,
            start_date.isoformat(),
            end_date.isoformat(),
            user_id
        )
        
        target = goal['target_value']
        percentage = (progress / target * 100) if target > 0 else 0
        
        return {
            'goal_id': goal_id,
            'goal_title': goal['title'],
            'frequency': frequency,
            'current_value': progress,
            'target_value': target,
            'percentage': min(percentage, 100),
            'period_label': ProgressService.get_period_label(frequency)
        }
    
    @staticmethod
    def get_year_calendar(year: Optional[int], user_id: int) -> dict:
        """Get year calendar view with check-in counts for a user"""
        if year is None:
            year = date.today().year
        
        year_summary = CheckInRepository.get_year_summary(year, user_id)
        
        return {
            'year': year,
            'calendar': year_summary
        }
    
    @staticmethod
    def get_day_details(check_date: str, user_id: int) -> dict:
        """Get all check-ins and reflections for a specific day for a user"""
        checkins = CheckInRepository.get_by_date(check_date, user_id)
        
        # Enrich with goal information
        enriched_checkins = []
        for checkin in checkins:
            goal = GoalRepository.get_by_id(checkin['goal_id'], user_id)
            enriched_checkins.append({
                **checkin,
                'goal_title': goal['title'] if goal else 'Unknown Goal',
                'goal_frequency': goal['frequency'] if goal else None
            })
        
        return {
            'date': check_date,
            'total_checkins': len(enriched_checkins),
            'checkins': enriched_checkins
        }

