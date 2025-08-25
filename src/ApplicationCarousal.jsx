import Slider from "react-slick";

const ApplicationsCarousel = ({ apps }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "40px",
    responsive: [
      {
        breakpoint: 1024, // tablet
        settings: {
          slidesToShow: 2,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 640, // mobile
        settings: {
          slidesToShow: 1,
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    <Slider {...settings} className="my-10">
      {apps.map((app, index) => (
        <ApplicationCard key={index} app={app} index={index} />
      ))}
    </Slider>
  );
};
