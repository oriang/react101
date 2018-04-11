import * as React from "react";
import { rawData } from "../data/raw.data";

const toFloat = field => parseFloat(field.price.replace("₪", ""));
const sum = (a, b) => a + b;

export class App extends React.Component {
    state = {
        csv: rawData,
        data: []
    };

    handleTextAreaChange = ev => {
        this.setState({
            csv: ev.value
        });
    };

    generateReport = () => {
        console.log("start generate report...");
    };

    csvHandler = csv => {
        const lines = csv.split("\n");

        const result = [];

        const headers = lines[0].split(",");

        lines.map(line => {
            const obj = {};
            const currentLine = line.split(",");

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentLine[j];
            }
            result.push(obj);
        });
        return result;
    };

    calculateExpanses = expanses => {
        const dailyBudget = 400;
        const [header, ...fields] = expanses;
        const formatedPrices = fields.map(toFloat);
        const totalExpanses = formatedPrices.reduce(sum);
        const employeeExpanses = formatedPrices
            .map(expanse => expanse > dailyBudget && expanse - dailyBudget)
            .reduce(sum);
        return {
            totalExpanses,
            employeeExpanses,
            companyExpanses: totalExpanses - employeeExpanses
        };
    };

    render() {
        const { csv, data } = this.state;

        return (
            <div className="flexbox-column" style={{ padding: 16, alignItems: "left" }}>
                <div style={{ fontSize: 24, paddingBottom: 16 }}>10bis Report</div>

                <div style={{ paddingBottom: 16, width: "100%" }}>
                    <textarea
                        style={{ height: 200, width: "100%" }}
                        value={csv}
                        onChange={this.handleTextAreaChange}
                    />
                </div>

                <div>Add the report here</div>
                <div style={styles.container}>
                    <table style={styles.table}>
                        <tbody>
                            <tr>
                                <th>{this.csvHandler(rawData)[0].id}</th>
                                <th>{this.csvHandler(rawData)[0].date}</th>
                                <th>{this.csvHandler(rawData)[0].time}</th>
                                <th>{this.csvHandler(rawData)[0].rest}</th>
                                <th>{this.csvHandler(rawData)[0].price}</th>
                            </tr>
                            {this.csvHandler(rawData).map(item => {
                                const row = `${item.id}   ${item.date}   ${item.time}   ${
                                    item.rest
                                }
                          ${item.price}`;
                                if (item.price !== "price") {
                                    return (
                                        <tr key={item.id}>
                                            <td style={styles.tableRow}>{item.id}</td>
                                            <td style={styles.tableRow}>{item.date}</td>
                                            <td style={styles.tableRow}>{item.time}</td>
                                            <td style={styles.tableRow}>{item.rest}</td>
                                            <td style={styles.tableRow}>{item.price}</td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                </div>
                <div style={styles.expanses}>
                    <p>
                        Employee expenses:{" "}
                        {this.calculateExpanses(this.csvHandler(csv)).employeeExpanses}
                    </p>
                    <p>
                        Company expenses:{" "}
                        {this.calculateExpanses(this.csvHandler(csv)).companyExpanses}
                    </p>
                </div>
            </div>
        );
    }
}

const styles = {
    table: {
        width: "98%",
        margin: 10,
        padding: 15,
        borderRadius: 5,
        backgroundColor: "floralwhite"
    },
    tableRow: {
        fontFamily: "Helvetica",
        lineHeight: "150%",
        textAlign: "center"
    },
    expanses: {
        margin: 10,
        padding: 5,
        borderRadius: 5,
        fontFamily: "Helvetica",
        backgroundColor: "floralwhite"
    },
    container: {
        maxWidth: 650,
        width: "100%",
        height: 350,
        overflow: "scroll"
    }
};
