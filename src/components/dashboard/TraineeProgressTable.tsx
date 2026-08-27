import { useAppStore } from '../../store/useAppStore';
import { getLessonStatus } from '../../utils/lessonAccess';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export function TraineeProgressTable() {
  const accounts = useAppStore((s) => s.accounts);
  const lessons = useAppStore((s) => s.lessons);
  const progressByUser = useAppStore((s) => s.progress);

  const trainees = accounts.filter((a) => a.role === 'trainee');
  const trackedLessons = lessons.filter((l) => !l.isPlaceholder);

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-variant shadow-ambient">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-container-low font-mono text-xs uppercase tracking-wider text-secondary">
          <tr>
            <th className="px-4 py-3">พนักงาน Training</th>
            <th className="px-4 py-3">ความคืบหน้า</th>
            <th className="px-4 py-3">XP</th>
            <th className="px-4 py-3">จำนวนครั้งที่ทำแบบทดสอบ</th>
            <th className="px-4 py-3">คะแนนเฉลี่ย</th>
            <th className="px-4 py-3">ใช้งานล่าสุด</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-variant bg-surface-white">
          {trainees.map((trainee) => {
            const progress = progressByUser[trainee.id];
            const completedCount = trackedLessons.filter(
              (l) => getLessonStatus(l, progress) === 'completed',
            ).length;
            const allAttempts = Object.values(progress.lessons).flatMap((lp) => lp.quizAttempts);
            const avgScore =
              allAttempts.length > 0
                ? Math.round(
                    (allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length) * 100,
                  )
                : null;

            return (
              <tr key={trainee.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full font-display text-xs font-bold text-on-primary"
                      style={{ backgroundColor: trainee.avatarColor }}
                    >
                      {trainee.name.charAt(0)}
                    </span>
                    <span className="font-sans font-medium text-on-surface">{trainee.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24">
                      <ProgressBar
                        value={trackedLessons.length ? completedCount / trackedLessons.length : 0}
                      />
                    </div>
                    <span className="font-mono text-xs text-secondary">
                      {completedCount}/{trackedLessons.length}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-tertiary">{progress.xp}</td>
                <td className="px-4 py-3 font-sans text-secondary">{allAttempts.length}</td>
                <td className="px-4 py-3">
                  {avgScore === null ? (
                    <span className="text-secondary">—</span>
                  ) : (
                    <Badge tone={avgScore >= 70 ? 'success' : 'warning'}>{avgScore}%</Badge>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-secondary">
                  {new Date(progress.lastActiveAt).toLocaleDateString('th-TH')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
