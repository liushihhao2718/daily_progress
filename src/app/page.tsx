"use client";

import Image from "next/image";
import "./normalize.css";
import styled, { css } from "styled-components";
import { useState } from "react";

const Header = styled.header`
  width: 100vw;
  border-bottom: 1px black solid;
`;

const HeaderTitle = styled.div`
  padding-bottom: 20px;
`;

interface RollingTask {
  id: number;
  title: string;
  task_time: RollingTaskTime[];
}

enum RollingTaskTimeStatus {
  not_planed,
  planed, //◯
  doing, //◉
  finished, //⬤
  evnet, //◔
  migration, // ∅
}
interface RollingTaskTime {
  date: Date;
  status: RollingTaskTimeStatus;
}

const data: RollingTask[] = [
  {
    id: 1,
    title: "唸物理",
    task_time: [
      {
        date: new Date("2024/4/29"),
        status: RollingTaskTimeStatus.migration,
      },
      {
        date: new Date("2024/4/30"),
        status: RollingTaskTimeStatus.doing,
      },
      {
        date: new Date("2024/5/4"),
        status: RollingTaskTimeStatus.finished,
      },
    ],
  },

  {
    id: 2,
    title: "唸數學",
    task_time: [
      {
        date: new Date("2024/4/29"),
        status: RollingTaskTimeStatus.planed,
      },
      {
        date: new Date("2024/4/30"),
        status: RollingTaskTimeStatus.planed,
      },
      {
        date: new Date("2024/5/4"),
        status: RollingTaskTimeStatus.planed,
      },
    ],
  },
];

const week = Array(7)
  .fill(0)
  .map((_, i) => {
    const monday = getMonday(new Date());
    const d = new Date();
    d.setDate(monday.getDate() + i);
    return new Date(d);
  });

const WeekDate = styled.div`
  display: flex;
  span {
    padding: 10px;
    width: 30px;
    text-align: center;
  }

  span + span {
    border-left: 1px #e1e1e1 solid;
  }
`;

const Main = styled.main`
  padding-left: 10px;
`;
const Style = styled.div`
  display: flex;
`;
const TaskContent = styled.div`
  align-content: center;
`;

function sameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function Point({
  status,
  onClick,
}: {
  status: RollingTaskTimeStatus | undefined;
  onClick: any;
}) {
  if (status == undefined) {
    return (
      <span
        style={{ fontSize: "24px", color: "black" }}
        onClick={() => onClick()}
      >
        &nbsp;&nbsp;
      </span>
    );
  }
  const text = {
    [RollingTaskTimeStatus.not_planed]: '  ',
    [RollingTaskTimeStatus.planed]: "●", //◯
    [RollingTaskTimeStatus.doing]: "⦿", //◉
    [RollingTaskTimeStatus.finished]: "●", //⬤
    [RollingTaskTimeStatus.evnet]: "◔", //◔
    [RollingTaskTimeStatus.migration]: "⧁", // ∅
  };
  if (status == RollingTaskTimeStatus.planed) {
    return (
      <span
        style={{ fontSize: "24px", color: "lightgray" }}
        onClick={() => onClick()}
      >
        {text[status]}
      </span>
    );
  } else {
    return (
      <span
        style={{ fontSize: "24px", color: "black" }}
        onClick={() => onClick()}
      >
        {text[status]}
      </span>
    );
  }
}

export default function Home() {
  const [tasks, setTasks] = useState(data);
  function changeStatue(task: RollingTask, date: Date) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          const task_time_index = task.task_time.findIndex((tt) =>
            sameDay(tt.date, date)
          );

          if (task_time_index == -1) {
            return Object.assign(t, {
              task_time: [
                ...t.task_time,
                { date, status: RollingTaskTimeStatus.planed },
              ],
            });
          }

          return Object.assign(t, {
            task_time: t.task_time.map((tt, i) => {
              if (i == task_time_index)
                return Object.assign(tt, { status: (tt.status + 1) % 4 });
              else return tt;
            }),
          });
        } else return t;
      })
    );
  }
  const Task = ({
    className,
    children,
    todo,
  }: {
    className?: string;
    children?: JSX.Element;
    todo: RollingTask;
  }) => {
    return (
      <>
        <Style className={className}>
          <WeekDate>
            {week.map((d, i) => {
              const t = todo.task_time.find((t) => sameDay(d, t.date));
              return (
                <Point
                  key={i}
                  status={t?.status}
                  onClick={() => changeStatue(todo, d)}
                />
              );
            })}
          </WeekDate>
          <TaskContent>{todo.title}</TaskContent>
        </Style>
      </>
    );
  };
  return (
    <>
      <Header>
        <div style={{ padding: "0 10px" }}>
          <HeaderTitle>April</HeaderTitle>
          <WeekDate>
            {week.map((d, i) => (
              <span key={i}>{d.getDate()}</span>
            ))}
          </WeekDate>
        </div>
      </Header>
      <Main>
        {tasks.map((d, i) => (
          <Task key={i} todo={d} />
        ))}
      </Main>
    </>
  );
}

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1);

  // adjust when day is sunday
  return new Date(d.setDate(diff));
}
