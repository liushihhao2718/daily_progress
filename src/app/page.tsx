"use client";

import Image from "next/image";
import "./normalize.css";
import styled, { css } from "styled-components";
import { useState, useCallback } from "react";
import { DropDownLi, Dropbtn, DropDownContent, SubA } from "./Menu";
import { useLongPress } from "use-long-press";

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
const keys = Object.keys(RollingTaskTimeStatus);
const enumValues = keys.slice(keys.length / 2);
interface RollingTaskTime {
  date: Date;
  status: RollingTaskTimeStatus;
}

const data: RollingTask[] = [
  {
    id: 1,
    title: "Task A",
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
    title: "Task B",
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
    const d = getMonday(new Date());

    d.setDate(d.getDate() + i);
    return d;
  });

const WeekDate = styled.div`
  display: flex;
  span {
    padding: 10px;
    width: 30px;
    text-align: center;
    user-select: none;
  }

  span + span {
    border-left: 1px #e1e1e1 solid;
  }
  div + div {
    border-left: 1px #e1e1e1 solid;
  }
`;

const Main = styled.main`
  padding-left: 10px;
`;
const Flex = styled.div`
  display: flex;
`;
const TaskContent = styled.input`
  align-content: center;
  border: 0;
  &:focus {
    outline: none;
  }
`;

function sameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
const RollingTaskTimeStatusMap = {
  [RollingTaskTimeStatus.not_planed]: "  ",
  [RollingTaskTimeStatus.planed]: "●", //◯
  [RollingTaskTimeStatus.doing]: "⦿", //◉
  [RollingTaskTimeStatus.finished]: "●", //⬤
  [RollingTaskTimeStatus.evnet]: "◔", //◔
  [RollingTaskTimeStatus.migration]: "⧁", // ∅
};
function Point({
  status,
  onClick = null,
}: {
  status: RollingTaskTimeStatus | undefined;
  onClick?: any;
}) {
  if (status == undefined) {
    return (
      <span
        style={{ fontSize: "24px", color: "black" }}
        onClick={() => onClick ?? onClick()}
      >
        &nbsp;&nbsp;
      </span>
    );
  }

  if (status == RollingTaskTimeStatus.planed) {
    return (
      <span
        style={{ fontSize: "24px", color: "lightgray" }}
        onClick={() => onClick ?? onClick()}
      >
        {RollingTaskTimeStatusMap[status]}
      </span>
    );
  } else {
    return (
      <span
        style={{ fontSize: "24px", color: "black" }}
        onClick={() => onClick ?? onClick()}
      >
        {RollingTaskTimeStatusMap[status]}
      </span>
    );
  }
}
const Tips = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
  border: 1px black solid;
  padding: 0px 12px 8px 12px;
`;
export default function Home() {
  const [tasks, setTasks] = useState(data);
  const [openTask, setOpenTask] = useState("");

  function handleStateClick(task: RollingTask, date: Date) {
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

  function handleStateChange(
    task: RollingTask,
    date: Date,
    state: RollingTaskTimeStatus
  ) {
    console.log("setstate");

    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          const task_time_index = task.task_time.findIndex((tt) =>
            sameDay(tt.date, date)
          );

          if (task_time_index == -1) {
            return Object.assign(t, {
              task_time: [...t.task_time, { date, status: state }],
            });
          }

          return Object.assign(t, {
            task_time: t.task_time.map((tt, i) => {
              if (i == task_time_index)
                return Object.assign(tt, { status: state });
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
    const callback = useCallback((evnet: string, meta: { context: any }) => {
      setOpenTask(meta.context);
    }, []);

    //@ts-ignore
    const bind = useLongPress(callback);
    return (
      <Flex className={className}>
        <WeekDate>
          {week.map((d, i) => {
            const t = todo.task_time.find((t) => sameDay(d, t.date));
            const currentId = `${todo.id}-${d.toISOString()}`;
            return (
              <DropDownLi key={currentId} {...bind(currentId)}>
                <Dropbtn>
                  <Point
                    status={t?.status}
                    onClick={() => handleStateClick(todo, d)}
                  />
                </Dropbtn>
                <DropDownContent open={currentId == openTask}>
                  {enumValues.map((status, i) => {
                    return (
                      <Point
                        key={currentId + i}
                        //@ts-ignore
                        status={RollingTaskTimeStatus[status]}
                        onClick={() => {
                          setOpenTask("");

                          handleStateChange(
                            todo,
                            d,
                            //@ts-ignore
                            RollingTaskTimeStatus[status]
                          );
                        }}
                      />
                    );
                  })}
                </DropDownContent>
              </DropDownLi>
            );
          })}
        </WeekDate>
        <TaskContent value={todo.title} onChange={() => {}} />
      </Flex>
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
      <Tips>
        <div style={{ paddingTop: "5px", fontWeight: 500 }}>Tips:</div>
        {enumValues.slice(1).map((status, i) => {
          return (
            <div key={i}>
              <Point
                //@ts-ignore
                status={RollingTaskTimeStatus[status]}
              />

              <span style={{ marginLeft: "5px" }}>{status}</span>
            </div>
          );
        })}
      </Tips>
    </>
  );
}

function getMonday(d: Date) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1);

  // adjust when day is sunday
  return new Date(d.setDate(diff));
}
