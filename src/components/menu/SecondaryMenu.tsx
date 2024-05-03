import { useState, useEffect, FC, ChangeEvent } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import eventBus, { EventCallback } from "../../utils/eventBus";
import { AppState } from "../../store/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useLazyGetChildrenListQuery } from "@/services/parentApi";
import {
  BadgeCheck,
  BookText,
  FileSearch2,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";

const SecondaryMenu: FC = () => {
  const user = useSelector((state: AppState) => state.auth);
  const [menus, setMenus] = useState([{}]);
  const [wardIndex, setWardIndex] = useState<number | null>(null);
  const [wards, setWards] = useState<
    { first_name: string; last_name: string; user_id: string }[]
  >([]);
  const [childNav, setChildNav] = useState<
    {
      id: number;
      name: string;
      href: string;
      icon: JSX.Element;
    }[]
  >([]);

  const [getChildrenList, { data }] = useLazyGetChildrenListQuery();

  const router = useRouter();

  useEffect(() => {
    let routerPath = user.role === "student" ? "students" : "teachers";

    if (user.role === "teacher") {
      let _menus = [
        {
          id: 1,
          name: "Profile",
          href: `/${routerPath}/profile`,
          icon: <UserRound />,
        },
        // { id: 2, name: "Skills", href: `/${routerPath}/skillset` },
        {
          id: 2,
          name: "Classrooms",
          href: `/${routerPath}/classroom`,
          icon: <Users />,
        },
      ];
      setMenus(_menus);
    } else if (user.role === "student") {
      let _menus = [
        {
          id: 1,
          name: "Profile",
          href: `/${routerPath}/profile`,
          icon: <UserRound />,
        },
        {
          id: 2,
          name: "Classrooms",
          href: `/${routerPath}/classroom`,
          icon: <Users />,
        },
        {
          id: 3,
          name: "Subject",
          href: `/${routerPath}/subjects`,
          icon: <BookText />,
        },
        {
          id: 4,
          name: "Recommendation",
          href: `/${routerPath}/recommendation`,
          icon: <BadgeCheck />,
        },
        {
          id: 5,
          name: "Results",
          href: `/${routerPath}/results`,
          icon: <FileSearch2 />,
        },
      ];
      setMenus(_menus);
    } else if (user.role === "parent") {
      getChildrenList({
        orgCode: user.org_code,
        userId: user.user_id,
      });
      let _menus = [
        {
          id: 1,
          name: "Profile",
          href: `/${user.role}s/profile`,
          icon: <UserRound />,
        },
        {
          id: 2,
          name: "Add Child",
          href: `/${user.role}s/add_child`,
          icon: <UserPlus />,
        },
      ];
      setMenus(_menus);
    }

    const incrementListener: EventCallback = (data) => {
      console.log("Menu");
    };

    eventBus.on("increment", incrementListener);

    return () => {
      eventBus.off("increment", incrementListener);
    };
  }, [user, wardIndex, data]);

  useEffect(() => {
    if (data) {
      const v = data.filter((stds) => stds.user_id != "-1");
      if (v.length) {
        let i = 0;
        if (wardIndex) {
          i = wardIndex;
        }
        setChildNav([
          {
            id: 1,
            name: `${v[i].first_name}'s Subjects`,
            href: `/${user.role}s/${v[i].user_id}/subjects`,
            icon: <BookText />,
          },
          {
            id: 2,
            name: `${v[i].first_name}'s Classroom`,
            href: `/${user.role}s/${v[i].user_id}/classroom`,
            icon: <Users />,
          },
          {
            id: 3,
            name: `${v[i].first_name}'s Recommendations`,
            href: `/${user.role}s/${v[i].user_id}/recommendation`,
            icon: <BadgeCheck />,
          },
          {
            id: 4,
            name: `${v[i].first_name}'s Profile`,
            href: `/${user.role}s/${v[i].user_id}/profile`,
            icon: <UserRound />,
          },
          {
            id: 4,
            name: `${v[i].first_name}'s Result`,
            href: `/${user.role}s/${v[i].user_id}/result`,
            icon: <FileSearch2 />,
          },
        ]);
        setWards(v);
      }
    }
  }, [data, wardIndex]);

  return (
    <>
      <nav className="w-full flex gap-7 flex-col">
        <menu className="flex flex-col w-full">
          {menus.map((_menu: any) => (
            <Link
              href={`${_menu.href}`}
              key={`${_menu.id}`}
              className={`rounded-md text-nowrap py-2 flex gap-4 px-6 h-12 items-center hover:border-[#17B3A6] hover:border ${
                router.asPath.startsWith(_menu.href) &&
                "bg-[#213B9D] border-l-8 border-[#17B3A6] border-solid font-semibold"
              }`}
            >
              <span
                className={`${router.asPath.startsWith(_menu.href) && "-ml-2"}`}
              >
                {_menu.icon}
              </span>
              <span> {_menu.name}</span>
            </Link>
          ))}
        </menu>
        <hr
          className={`h-[1px] w-11/12 mx-2.5 bg-white/50 ${
            !childNav.length && "hidden"
          }`}
        />
        {!!childNav.length && (
          <menu className="flex flex-col w-full">
            {childNav.map((_menu: any) => (
              <Link
                href={`${_menu.href}`}
                key={`${_menu.id}`}
                className={`rounded-md text-nowrap py-2 flex gap-4 px-6 h-12 items-center hover:border-[#17B3A6] hover:border ${
                  router.asPath.startsWith(_menu.href) &&
                  "bg-[#213B9D] border-l-8 border-[#17B3A6] border-solid font-semibold"
                }`}
              >
                <span
                  className={`${
                    router.asPath.startsWith(_menu.href) && "-ml-2"
                  }`}
                >
                  {_menu.icon}
                </span>
                <span> {_menu.name}</span>
              </Link>
            ))}
          </menu>
        )}
      </nav>
      <hr className="h-[1px] w-11/12 mx-2.5 bg-white/50" />
      {user.role != "teacher" && (
        <div className="flex gap-4 flex-col w-full px-6">
          {user.role === "parent" && wards?.length > 1 && (
            <div className="flex gap-3 items-center justify-between  max-w-64">
              <p>Child</p>
              <Select
                onValueChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setWardIndex(+e)
                }
              >
                <SelectTrigger className="w-40 border border-solid border-[#7cc5b9]">
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((val, i) => (
                    <SelectItem value={i.toString()} key={i}>
                      {val.first_name + " " + val.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex gap-3 items-center justify-between  max-w-64">
            <p>Subject</p>
            <Select>
              <SelectTrigger className="w-40 border border-solid border-[#7cc5b9]">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mathematics">Mathematics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </>
  );
};

export default SecondaryMenu;
