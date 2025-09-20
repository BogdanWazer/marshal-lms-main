import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { adminGetCourseCompletionStats, adminGetUserProgressStats, adminGetMonthlyProgressStats } from "../../data/admin/admin-get-course-completion-stats";
import { adminGetDashboardStats } from "../../data/admin/admin-get-dashboard-stats";
import { IconBook, IconUsers, IconTrendingUp, IconCheck } from "@tabler/icons-react";
import { CourseCompletionChart } from "./_components/CourseCompletionChart";
import { MonthlyProgressChart } from "./_components/MonthlyProgressChart";
import { EnrollmentChart } from "./_components/EnrollmentChart";

export default async function AnalyticsPage() {
  const [courseStats, userStats, monthlyStats, dashboardStats] = await Promise.all([
    adminGetCourseCompletionStats(),
    adminGetUserProgressStats(),
    adminGetMonthlyProgressStats(),
    adminGetDashboardStats(),
  ]);

  // Top performing courses (by completion rate)
  const topCourses = courseStats
    .filter(course => course.totalEnrollments > 0)
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 5);

  // Top performing users (by progress percentage)
  const topUsers = userStats
    .filter(user => user.totalLessons > 0)
    .sort((a, b) => b.progressPercentage - a.progressPercentage)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into course completion and user engagement
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardDescription>Total Courses</CardDescription>
              <CardTitle className="text-2xl font-semibold">{dashboardStats.totalCourses}</CardTitle>
            </div>
            <IconBook className="size-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Available courses on platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardDescription>Active Students</CardDescription>
              <CardTitle className="text-2xl font-semibold">{dashboardStats.totalCustomers}</CardTitle>
            </div>
            <IconUsers className="size-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Students enrolled in courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardDescription>Avg Completion Rate</CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {courseStats.length > 0 
                  ? Math.round(courseStats.reduce((acc, course) => acc + course.completionRate, 0) / courseStats.length)
                  : 0}%
              </CardTitle>
            </div>
            <IconTrendingUp className="size-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Average course completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardDescription>Total Lessons</CardDescription>
              <CardTitle className="text-2xl font-semibold">{dashboardStats.totalLessons}</CardTitle>
            </div>
            <IconCheck className="size-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Learning content available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Completion Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Course Completion Rates</CardTitle>
            <CardDescription>
              Completion rates by course (courses with enrollments only)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CourseCompletionChart data={courseStats} />
          </CardContent>
        </Card>

        {/* Monthly Progress Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Lesson Completions</CardTitle>
            <CardDescription>
              Lesson completion trend over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyProgressChart data={monthlyStats} />
          </CardContent>
        </Card>
      </div>

      {/* Top Performers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Courses</CardTitle>
            <CardDescription>
              Courses with highest completion rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <div key={course.courseId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{course.courseTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.totalEnrollments} students • {course.totalLessons} lessons
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{course.completionRate}%</p>
                    <p className="text-xs text-muted-foreground">completion</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Students */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Students</CardTitle>
            <CardDescription>
              Students with highest progress percentages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{user.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.enrolledCourses} courses • {user.completedLessons}/{user.totalLessons} lessons
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{user.progressPercentage}%</p>
                    <p className="text-xs text-muted-foreground">progress</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Enrollment Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Course Enrollment Distribution</CardTitle>
          <CardDescription>
            Number of enrollments per course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnrollmentChart data={courseStats} />
        </CardContent>
      </Card>
    </div>
  );
}