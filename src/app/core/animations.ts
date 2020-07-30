import { trigger, state, style, transition, animate, group } from "@angular/animations";

export const SlideInOutAnimation = [
  trigger("slideInOut", [
    state(
      "in",
      style({
        "max-height": "100%",
        "max-width": "100%",
        opacity: "1",
        visibility: "visible"
      })
    ),
    state(
      "out",
      style({
        "max-height": "0%",
        "max-width": "0%",
        opacity: "0",
        visibility: "hidden"
      })
    ),
    transition("in => out", [
      group([
        animate(
          "200ms ease-in-out",
          style({
            visibility: "hidden"
          })
        ),
        animate(
          "300ms ease-in-out",
          style({
            "max-height": "0%",
            "max-width": "0%"
          })
        )
      ])
    ]),
    transition("out => in", [
      group([
        animate(
          "1ms ease-in-out",
          style({
            visibility: "visible"
          })
        ),
        animate(
          "400ms ease-in-out",
          style({
            "max-height": "100%",
            "max-width": "100%"
          })
        ),
        animate(
          "500ms ease-in-out",
          style({
            opacity: "1"
          })
        )
      ])
    ])
  ])
];
